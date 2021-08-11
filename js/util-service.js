'use strict'

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
const getRandomKWs = () => {
    let keyWordBank = ['funny', 'meme-y', 'true', 'scary', 'stupid', 'goofy', 'photo'];
    return [keyWordBank.splice(getRandomInt(0, keyWordBank.length), 1)[0],
     keyWordBank.splice(getRandomInt(0, keyWordBank.length), 1)[0]]
}