'use strict'

const gKeyWords = {};
const gImgs = []
let gIdx = 1;
let gMeme = {};
let gFilterBy = ''



const memeInit = () => {
    gMeme = {
        selectedImgId: 1,
        selectedLineIdx: 0,
        lines: [{
            txt: 'Change me(me)',
            size: 55,
            align: 'center',
            color: 'white',
            lineWidth: 0,
            font: 'impact',
            strokeClr: 'black',
            pos: {
                x: 10,
                y: 100
            },
            drag: false
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
        align: 'center',
        color: 'white',
        lineWidth: 0,
        font: 'impact',
        strokeClr: 'black',
        pos: {
            x: 10,
            y: 100
        },
        drag: false
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

const changeStroke = (color) => {
    gMeme.lines[gMeme.selectedLineIdx].strokeClr = color;
    renderCanvas()
}

const switchAlign = alignTo => {
    gMeme.lines[gMeme.selectedLineIdx].align = alignTo
    renderCanvas()
}

const getKeywordMap = () => {
    gImgs.forEach((img) => {
        img.keyWords.forEach(kw => {
            gKeyWords[kw] ? gKeyWords[kw]++ : gKeyWords[kw] = 1;
        })
    })
    return gKeyWords
}

const setFilter = filterBy => {
    gFilterBy = filterBy;
    gKeyWords[filterBy]++;

}
const setLineWidth = width => gMeme.lines[gMeme.selectedLineIdx].lineWidth = width;

const setIsDrag = isDrag => {
    if (isDrag)
        gMeme.lines[gMeme.selectedLineIdx].isDrag = isDrag
    return gMeme.lines[gMeme.selectedLineIdx].isDrag;
};

const getFilteredImgs = filter => {
    return gImgs.filter(img => {
        let kwsStr = img.keyWords.join()
        if (kwsStr.includes(filter))
            return true
    })
}