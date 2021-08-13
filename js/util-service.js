'use strict'

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
const getRandomKWs = () => {
    let keyWordBank = ['funny', 'meme', 'true', 'scary', 'stupid', 'goofy', 'photo'];
    return [keyWordBank.splice(getRandomInt(0, keyWordBank.length), 1)[0],
        keyWordBank.splice(getRandomInt(0, keyWordBank.length), 1)[0]
    ]
}

function makeId(length = 5) {
    var txt = '';
    var possible = '0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}