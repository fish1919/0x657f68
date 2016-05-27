
const { dialog } = require('electron').remote;

const { basename } = require('path');
const { writeFileSync } = require('fs');

const { ImageRequest } = require('../../lib/hentai');

const ImageMiddleware = ({
    elm,
    menu,
    click
}, next) => {

    var node = elm;

    const template = [
        {
            label: 'Save image as...',
            click: (menuItem, focusedWindow) => {

                var path = dialog.showSaveDialog({
                    filters: [
                        {
                            name: 'Images',
                            extensions: ['bmp', 'jpg', 'png', 'gif']
                        },
                        {
                            name: 'All',
                            extensions: ['*']
                        }
                    ],
                    defaultPath: node.src.startsWith('ximage') || node.src.startsWith('http') ? basename(node.src) : (node.alt ? node.alt : 'image.jpg')
                });

                if(!path) {
                    return;
                }

                if(node.src.startsWith('data')) {

                    let err = writeFileSync(path, new Buffer(node.src.split(',').slice(1).join(''), 'base64'));

                    if(err) {
                        return alert(err);
                    }

                }
                else if(node.src.startsWith('ximage') || node.src.startsWith('http')) {

                    ImageRequest(node.src.replace('ximage://', 'http://'), {}, () => {}, () => {}, (err, id, res, body) => {

                        if(err) {
                            return alert(err.toString());
                        }

                        var err = writeFileSync(path, body);

                        if(err) {
                            return alert(err);
                        }

                    });

                }

            }
        }
    ];

    while(node) {

        if(node.matches('img')) {
            Array.prototype.push.apply(menu, template);
            break;
        }

        node = node.parentElement;

    }

    next();

};

module.exports = ImageMiddleware;
