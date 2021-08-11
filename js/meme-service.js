'use strict'

const gKeyWords = {};
const gImgs = []
let gIdx = 1;
let gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,

    lines: [{
        txt: 'Change me(me)!',
        size: 24,
        align: 'left',
        color: 'white'
    }]
};


const createImgs = () => {
    for (let i = 0; i < 18; i++) {
        gImgs.push({
            url: `../imgs/square/${i+1}.jpg`,
            id: gIdx++,
            keyWords: getRandomKW(),
        })
    }
}

const getRandomKW = () => {
    let keyWordBank = ['funny', 'meme-y','true','scary','stupid','goofy','photo'];
    
    return [keyWordBank.splice(getRandomInt(0,keyWordBank.length),1)[0],keyWordBank.splice(getRandomInt(0,keyWordBank.length),1)[0]]
}

const setMeme = (id) => {
    gMeme.selectedImgId = id;
}