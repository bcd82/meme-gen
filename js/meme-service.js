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
            url: `../imgs/square/${}`
            id: gIdx++,
        })
    }
}