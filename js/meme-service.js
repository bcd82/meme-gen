'use strict'

const gKeyWords = {};
const gImgs = []
let gIdx = 1;
let gMeme = {};


const memeInit = () =>{
    gMeme = {
        selectedImgId: 1,
        selectedLineIdx: 0,
        lines: [{
            txt: 'Change me(me)!',
            size: 44,
            align: 'left',
            color: 'white',
            font:'impact',
            pos: {x:10,y:100}
        }]
    };
}
const createImgs = () => {
    for (let i = 0; i < 18; i++) {
        gImgs.push({
            url: `../imgs/square/${i+1}.jpg`,
            id: gIdx++,
            keyWords: getRandomKWs(),
        })
    }
}

const setMeme = (id) => {
    console.log(gMeme)
    // set gMeme
    gMeme.selectedImgId = id;
    //display image on canvas
    const img = gImgs.find(img=> img.id === id)
    setMemeImg(img.url)
    //open editor
}