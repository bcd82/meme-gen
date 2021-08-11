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
            align: 'left',
            color: 'white',
            font: 'impact',
            stroke: true,
            pos: {
                x: 10,
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
    gMeme.selectedImgId = id;
    const img = gImgs.find(img => img.id === id)
    setMemeImg(img.url)
}

const getMeme = () => gMeme;

const changeText = (val) => {
    gMeme.lines[gMeme.selectedLineIdx].txt = val;
    renderCanvas()
}

const addText = () => {
    const newLine = {
        txt: 'Change me(me)',
        size: 55,
        align: 'left',
        color: 'white',
        font: 'impact',
        stroke: true,
        pos: {
            x: 10,
            y: 100
        }
    }

    if (gMeme.lines.length === 1)
        newLine.pos.y = 500;
    if (gMeme.lines.length >= 2)
        newLine.pos.y = 300;

    gMeme.selectedLineIdx++;
    gMeme.lines.push(newLine)
    renderCanvas()
}

const moveText = diff => {
    gMeme.lines[gMeme.selectedLineIdx].pos.y += diff;
    renderCanvas()
}

const switchText = () => {
    if (gMeme.lines.length === gMeme.selectedLineIdx + 1) {
        gMeme.selectedLineIdx = 0;

    } else {
        gMeme.selectedLineIdx++;
    }
    renderCanvas()
}

const deleteText = () => {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    if (!gMeme.lines.length)
        gMeme.selectedLineIdx = -1;
    else
        gMeme.selectedLineIdx = 0;
    renderCanvas()
}

const resizeFont = diff => {
    gMeme.lines[gMeme.selectedLineIdx].size += diff;
    renderCanvas()
}

const changeFont = font => {
    gMeme.lines[gMeme.selectedLineIdx].font = font;
    renderCanvas()
}

const changeColor = color => {
    gMeme.lines[gMeme.selectedLineIdx].color = color;
    renderCanvas()
}

const toggleStroke = () => {
    gMeme.lines[gMeme.selectedLineIdx].stroke = !gMeme.lines[gMeme.selectedLineIdx].stroke;
    renderCanvas()
}

const switchAlign = alignTo => {
    gMeme.lines[gMeme.selectedLineIdx].align = alignTo
    renderCanvas()
}