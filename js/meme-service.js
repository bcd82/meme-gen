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
            txt: 'Change me',
            size: 55,
            align: 'center',
            color: 'white',
            width: 0,
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

const getSelectedLine = () =>{
    return gMeme.lines[gMeme.selectedLineIdx];
}
const changeText = (val) => {
    gMeme.lines[gMeme.selectedLineIdx].txt = val;
    renderCanvas()
}

const addLine = () => {
    const newLine = {
        txt: 'Change me',
        size: 55,
        align: 'center',
        color: 'white',
        width: 0,
        font: 'impact',
        strokeClr: 'black',
        pos: {
            x: 10,
            y: 100
        },
        drag: false
    }

    if (gMeme.lines.length === 1)
        newLine.pos.y = gElCanvas.height - 50;
    if (gMeme.lines.length >= 2)
        newLine.pos.y = gElCanvas.height /2;

    gMeme.selectedLineIdx++;
    gMeme.lines.push(newLine)
    renderCanvas()
}

const moveText = diff => {
    gMeme.lines[gMeme.selectedLineIdx].pos.y += diff;
    renderCanvas()
}

const switchText = (idx) => {
    if(idx > -1) {
        gMeme.selectedLineIdx = idx;
    } else {
        if (gMeme.lines.length === gMeme.selectedLineIdx + 1) {
            gMeme.selectedLineIdx = 0;
    
        } else {
            gMeme.selectedLineIdx++;
        }
    }
    document.querySelector('input[type=text]').value = gMeme.lines[gMeme.selectedLineIdx].txt;
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
const setLineWidth = width => gMeme.lines[gMeme.selectedLineIdx].width = width;

const setIsDrag = isDrag => {
    if(!gMeme.lines[gMeme.selectedLineIdx]) return;
    if ((isDrag || isDrag === false))
        gMeme.lines[gMeme.selectedLineIdx].drag = isDrag
    return gMeme.lines[gMeme.selectedLineIdx].drag;

};

const getFilteredImgs = filter => {
    return gImgs.filter(img => {
        let kws = img.keyWords
        if (kws.some((kw) => { return kw === filter}))
            return true
    })
}