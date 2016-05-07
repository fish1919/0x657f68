
const { join } = require('path');
const { existsSync, writeFileSync, createReadStream, unlinkSync } = require('fs');
const { createHash } = require('crypto');

const mkdirp = require('mkdirp');

const DIR_CACHES = './caches/';
mkdirp.sync(DIR_CACHES);

class Cache {

    constructor() {

    }

    path(id) {
        return join(DIR_CACHES, id);
    }

    Id(input) {

        const hash = createHash('md5');
        hash.update(input);

        return hash.digest('hex');

    }

    Add(id, data) {

        const path = this.path(id);

        writeFileSync(path, data, {
            encoding: null
        });

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

module.exports = new Cache();
