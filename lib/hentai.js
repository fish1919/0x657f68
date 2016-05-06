
'use strict';

const request = require('request');

const cheerio = require('cheerio');

const Flow = require('node-flow');

class Resource {

    constructor({ url, type, name, torrentsUrl, imageUrl }) {

        this.Url = url;
        this.Type = type;
        this.Name = name;
        this.TorrentsUrl = torrentsUrl;
        this.ImageUrl = imageUrl;

    }

}

class Image {

    constructor({ url, name, imageUrl, width, height, offsetX }) {

        this.Url = url;
        this.Name = name;
        this.ImageUrl = imageUrl;
        this.Width = width;
        this.Height = height;
        this.OffsetX = offsetX;

    }

}

class BrowseResult {

    constructor({ url, pageIdx, pageCount, resources }) {

        this.Url = url;
        this.PageIdx = pageIdx;
        this.PageCount = pageCount;
        this.Resources = resources;

    }

}

class DetailResult {

    constructor({ url, pageIdx, pageCount, images }) {

        this.Url = url;
        this.PageIdx = pageIdx;
        this.PageCount = pageCount;
        this.Images = images;

    }

}

class ViewResult {

    constructor({ url, imageUrl }) {

        this.Url = url;
        this.ImageUrl = imageUrl;

    }

}

const Browse = ({
    useExtra = false,
    keywords = '',
    filters = {},
    pageIdx = 0,
    proxy = null
}, callback) => {

    const debug = require('debug')('Hentai.Browse');

    Flow(function*(cb) {

        const url = useExtra ? 'http://exhentai.org/' : 'http://g.e-hentai.org/';

        debug('url:', url);

        // FIXME: Crash when connection fails.
        // Because we are trying to destructure single variable into three.
        var [err, res, body] = yield request(url, {
            qs: {
                'f_doujinshi': filters.doujinshi ? 1 : 0,
                'f_manga': filters.manga ? 1 : 0,
                'f_artistcg': filters.artistcg ? 1 : 0,
                'f_gamecg': filters.gamecg ? 1 : 0,
                'f_western': filters.western ? 1 : 0,
                'f_non-h': filters.nonh ? 1 : 0,
                'f_imageset': filters.imageset ? 1 : 0,
                'f_cosplay': filters.cosplay ? 1 : 0,
                'f_asianporn': filters.asianporn ? 1 : 0,
                'f_misc': filters.misc ? 1 : 0,
                'f_search': keywords,
                'f_apply': 'Apply Filter',
                'page': pageIdx
            },
            headers: {
                'referer': url
            },
            proxy: proxy
        // Dirty fix.
        }, (err, res, body) => cb(err, res, body));

        if(err) {
            return callback(err);
        }

        debug('body:', body);

        const $ = cheerio.load(body);

        const parsedIdx = parseInt($('table.ptt td.ptds a').text()) - 1;
        const pageCount = parseInt($('table.ptt td').eq(-2).text());

        const resources = $('table.itg tr.gtr0, table.itg tr.gtr1').map((index, element) => {

            let $element = $(element);

            let url = $element.find('div.it5 a').attr('href');

            let type = $element.find('td.itdc img.ic').attr('alt');

            let name = $element.find('div.it5 a').text();

            let torrentsUrl = $element.find('div.it3 div.i a').attr('href');

            let imageUrl = $element.find('div.it2 img').attr('src') || $element.find('div.it2').text()
                .replace('init~ehgt.org~', 'http://ehgt.org/')
                .replace('init~ul.ehgt.org~', 'http://ul.ehgt.org/')
                .replace('init~st.exhentai.net~', 'http://st.exhentai.net/')
                .split('~')[0];

            return new Resource({
                url, type, name, torrentsUrl, imageUrl
            });

        }).get();

        return callback(null, new BrowseResult({
            url, pageCount, resources,
            pageIdx: parsedIdx
        }));

    });

};

const REGEX_NORMAL_THUMBNAIL = /div style="[^<>]+width:\s*(\d+)px;\s*height:\s*(\d+)px;[^<>]+?url\((.+)\)\s*-(\d+)px[^<>]+"/;

const Detail = ({
    url,
    pageIdx = 0,
    proxy = null
}, callback) => {

    const debug = require('debug')('Hentai.Detail');

    Flow(function*(cb) {

        debug('url:', url);

        var [err, res, body] = yield request(url, {
            qs: {
                p: pageIdx
            },
            headers: {
                'referer': url
            },
            proxy: proxy
        }, (err, res, body) => cb(err, res, body));

        if(err) {
            return callback(err);
        }

        debug('body:', body);

        const $ = cheerio.load(body);

        const parsedIdx = parseInt($('table.ptt td.ptds a').text()) - 1;
        const pageCount = parseInt($('table.ptt td').eq(-2).text());

        const images = $('div.gdtm').map((index, element) => {

            const [, width, height, imageUrl, offsetX] = REGEX_NORMAL_THUMBNAIL.exec($(element).html());

            return new Image({
                imageUrl, width, height, offsetX,
                url: $(element).find('a').attr('href'),
                name: $(element).find('img').attr('alt'),
            });

        }).get();

        return callback(null, new DetailResult({
            url, pageCount, images,
            pageIdx: parsedIdx
        }));

    });

};

const View = ({
    url, refererUrl,
    proxy = null
}, callback) => {

    const debug = require('debug')('Hentai.View');

    Flow(function*(cb) {

        debug('url:', url);

        var [err, res, body] = yield request(url, {
            headers: {
                'referer': refererUrl
            },
            proxy: proxy
        }, (err, res, body) => cb(err, res, body));

        if(err) {
            return callback(err);
        }

        debug('body:', body);

        const $ = cheerio.load(body);

        const imageUrl = $('img#img').attr('src');

        return callback(null, new ViewResult({
            url, imageUrl
        }));

    });

};

module.exports.Browse = Browse;
module.exports.Detail = Detail;
module.exports.View = View;
