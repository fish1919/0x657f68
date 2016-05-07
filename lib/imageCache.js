
const { join } = require('path');
const { existsSync, createWriteStream, createReadStream, unlinkSync } = require('fs');
const { createHash } = require('crypto');

const mkdirp = require('mkdirp');

const DIR_IMAGE_CACHES = './caches/images/';
mkdirp.sync(DIR_IMAGE_CACHES);

class ImageCache {

    constructor() {

    }

    path(id) {
        return join(DIR_IMAGE_CACHES, id);
    }

    Id(input) {

        const hash = createHash('md5');
        hash.update(input);

        return hash.digest('hex');

    }

    AddStream(id) {

        const path = this.path(id);
        const stream = createWriteStream(path);

        return stream;

    }

    Exist(id) {

        return existsSync(this.path(id));

    }

    GetStream(id) {

        const path = this.path(id);

        if(existsSync(path)) {

            const stream = createReadStream(path);

            return stream;

        }

        return null;

    }

    Remove(id) {

        if(existsSync(this.path(id))) {
            unlinkSync(this.path(id));
        }

    }

}

module.exports = new ImageCache();
