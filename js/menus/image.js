
const { dialog } = require('electron').remote;

const { writeFileSync } = require('fs');

const ImageMiddleware = ({
    elm,
    menu,
    click
}, next) => {

    var node = elm;

    const template = [
        {
            label: 'Save image as',
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
                    defaultPath: 'image.jpg'
                });

                writeFileSync(path, new Buffer(node.src.split(',').slice(1).join(''), 'base64'));

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
