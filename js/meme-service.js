'use strict'

const gKeyWords = {};
const gImgs = []
let gIdx = 1;
let gMeme = {};


const memeInit = () => {
    gMeme = {
        selectedImgId: 1,
        selectedLineIdx: 0,
        lines: [{
            txt: 'Change me(me)',
            size: 55,
            align: 'center',
            color: 'white',
            font: 'impact',
            isActive: true,
            pos: {
                x: gElCanvas.width / 2,
                y: 100
            }
        }]
    };
}
const createImgs = () => {
    for (let i = 0; i < 18; i++) {
        gImgs.push({
            url: `./imgs/square/${i+1}.jpg`,
            id: gIdx++,
            keyWords: getRandomKWs(),
        })
    }
}

const setMeme = (id) => {
    memeInit()
    console.log(gMeme)
    // set gMeme
    gMeme.selectedImgId = id;
    //display image on canvas
    const img = gImgs.find(img => img.id === id)
    setMemeImg(img.url)
    //open editor
}

const changeText = (val) => {
    let line = gMeme.lines.find(line => line.isActive === true)
    line.txt = val;
    renderCanvas()
}

const addText = () => {
    let line = gMeme.lines.find(line => line.isActive === true)
    line.isActive = false;
    const newLine = {
        txt: 'Change me(me)',
        size: 55,
        align: 'center',
        color: 'white',
        font: 'impact',
        isActive: true,
        pos: {
            x: gElCanvas.width / 2,
            y: 100
        }
    }

    if (gMeme.lines.length === 1)
        newLine.pos.y = 250;
    if (gMeme.lines.length === 2)
        newLine.pos.y = 450;
    if (gMeme.lines.length > 2) return;

    gMeme.lines.push(newLine)
    renderCanvas()
}