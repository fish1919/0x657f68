
'use strict';

var request = require('request');
request = request.defaults({
    headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.86 Safari/537.36'
    },
    jar: request.jar()
});

const createImageSizeStream = require('image-size-stream');

const wrapProgress = require('request-progress');

const cheerio = require('cheerio');

const Flow = require('node-flow');

const Cache = require('./cache');

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

    constructor({ url, isExtra, keywords, filters, pageIdx, pageCount, resources }) {

        this.Url = url;
        this.IsExtra = isExtra;
        this.Keywords = keywords;
        this.Filters = filters;
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

class LoginResult {

    constructor({ jar }) {

        this.Jar = jar;

    }

}

const BuildCookies = (cookies) => {

    if(!cookies) {
        return '';
    }

    let cookie = '';

    for(let key in cookies) {

        if(cookies[key]) {
            cookie += key + '=' + cookies[key] + ';';
        }

    }

    return cookie.slice(0, -1);

};

const BuildHeaders = ({
    referer = null,
    cookies = null
}) => {

    const headers = {};

    if(referer) {
        headers.referer = referer;
    }

    if(cookies) {
        headers.cookie = BuildCookies(cookies);
    }

    return headers;

};

const CachedRequest = (url, options, callback) => {

    const _identity = options && options._identity ? options._identity : url;

    const id = Cache.Id(_identity);

    if(Cache.Exist(id)) {

        let stream = Cache.GetStream(id);

        let chunks = [];
        stream
        .on('data', (chunk) => chunks.push(chunk))
        .on('error', (err) => callback(err))
        .on('end', () => callback(null, 'CACHED', Buffer.concat(chunks).toString(options.encoding)));

    }
    else {

        request(url, options, (err, res, body) => {

            if(!err) {
                Cache.Add(id, body);
            }

            callback(err, res, body);

        });

    }

};

// A wrapper for request specified for images.
const ImageRequest = (url, options, sizeCallback, progressCallback, endCallback) => {

    const _identity = options && options._identity ? options._identity : url;
    const _cookies = options && options._cookies ? options._cookies : url;

    const sizeStream = createImageSizeStream();
    sizeStream
    .on('size', (size) => sizeCallback(null, size))
    .on('error', (err) => sizeCallback(err));

    const id = Cache.Id(_identity);

    if(Cache.Exist(id)) {

        // FIXME: Sometimes no result.
        let stream = Cache.GetStream(id);

        let chunks = [];
        stream
        .on('data', (chunk) => chunks.push(chunk))
        .on('error', (err) => endCallback(err))
        .on('end', () => endCallback(null, 'CACHED', Buffer.concat(chunks)));

        // FIXME: If pipe, no data event will be emitted.
        //stream.pipe(sizeStream);

    }
    else {

        wrapProgress(request(url, Object.assign({}, options, {
            headers: BuildHeaders({
                cookies: url.indexOf('exhentai') >= 0 ? _cookies : null
            }),
            encoding: null
        }), (err, res, body) => {

            if(!err) {
                Cache.Add(id, body);
            }

            endCallback(err, res, body);

        }))
        .on('progress', (progress) => progressCallback(progress))
        .pipe(sizeStream);

    }

};

const Browse = ({
    useExtra = false,
    keywords = '',
    filters = {},
    pageIdx = 0,
    cookies = null,
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
            headers: BuildHeaders({
                referer: url,
                cookies: cookies
            }),
            proxy: proxy
        // Dirty fix.
        }, (err, res, body) => cb(err, res, body));

        if(err) {
            return callback(err);
        }

        debug('body:', body.toString());

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
                .replace('init~exhentai.org~', 'http://exhentai.org/')
                .split('~')[0];

            return new Resource({
                url, type, name, torrentsUrl, imageUrl
            });

        }).get();

        return callback(null, new BrowseResult({
            url, keywords, filters, pageCount, resources,
            isExtra: useExtra,
            pageIdx: parsedIdx
        }));

    });

};

const REGEX_NORMAL_THUMBNAIL = /div style="[^<>]+width:\s*(\d+)px;\s*height:\s*(\d+)px;[^<>]+?url\((.+)\)\s*-(\d+)px[^<>]+"/;

const Detail = ({
    url,
    pageIdx = 0,
    cookies = null,
    proxy = null
}, callback) => {

    const debug = require('debug')('Hentai.Detail');

    Flow(function*(cb) {

        debug('url:', url);

        var [err, res, body] = yield CachedRequest(url, {
            qs: {
                p: pageIdx
            },
            headers: BuildHeaders({
                referer: url,
                cookies: cookies
            }),
            proxy: proxy,
            _identity: url + '?' + pageIdx
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
    cookies = null,
    proxy = null
}, callback) => {

    const debug = require('debug')('Hentai.View');

    Flow(function*(cb) {

        debug('url:', url);

        var [err, res, body] = yield CachedRequest(url, {
            headers: BuildHeaders({
                referer: refererUrl,
                cookies: cookies
            }),
            proxy: proxy,
            _identity: url
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

// FIXME: Not support recaptcha, and spam blocking.
const Login = ({
    username,
    password,
    proxy = null
}, callback) => {

    const debug = require('debug')('Hentai.Login');

    Flow(function*(cb) {

        const refererUrl = 'https://forums.e-hentai.org/index.php?act=Login&CODE=00';
        const url = 'https://forums.e-hentai.org/index.php?act=Login&CODE=01';

        const jar = request.jar();

        var [err, res, body] = yield request(url, {
            method: 'POST',
            form: {
                referer: 'https://forums.e-hentai.org/',
                b: '',
                bt: '',
                UserName: username,
                PassWord: password,
                CookieDate: '1'
            },
            headers: {
                referer: refererUrl
            },
            jar: jar,
            proxy: proxy
        }, (err, res, body) => cb(err, res, body));

        if(err) {
            return callback(err);
        }

        debug('jar:', jar._jar.serializeSync());

        return callback(null, new LoginResult({
            jar: jar._jar.serializeSync()
        }));

    });

};

module.exports.ImageRequest = ImageRequest;
module.exports.Browse = Browse;
module.exports.Detail = Detail;
module.exports.View = View;
module.exports.Login = Login;
