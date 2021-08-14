'use strict'

const gKeyWords = {};
const gImgs = []
let gSavedMemes = [];
let gIdx = 1;
let gMeme = {};
let gFilterBy = ''



const memeInit = () => {
    gMeme = {
        selectedImgId: 1,
        selectedLineIdx: 0,
        selectedStickerIdx:-1,
        id: makeId(),
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
            drag: false,
        }],
        stickers: []
    };
    loadSavedMemes()
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

const setMeme = (id, isSaved) => {
    let img
    if (isSaved) {
        gMeme = gSavedMemes.find(meme => meme.id == id)
        img = gImgs.find(img => img.id === gMeme.selectedImgId)
    } else {
        memeInit()
        gMeme.selectedImgId = id;
        img = gImgs.find(img => img.id === id)
    }
    setMemeImg(img.url)
}

const getMeme = () => gMeme;

const getSelectedLine = () => {
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
        drag: false,
    }

    if (gMeme.lines.length === 1)
        newLine.pos.y = gElCanvas.height - 50;
    if (gMeme.lines.length >= 2)
        newLine.pos.y = gElCanvas.height / 2;

    gMeme.selectedLineIdx++;
    gMeme.lines.push(newLine)
    renderCanvas()
}

const switchText = (idx) => {
    if (idx > -1) {
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
    gFilterBy = filterBy.toLowerCase();
    gKeyWords[filterBy]++;

}
const setLineWidth = width => gMeme.lines[gMeme.selectedLineIdx].width = width;

const setLineDrag = (isDrag) => {
    if (!gMeme.lines[gMeme.selectedLineIdx]) return;
    if ((isDrag || isDrag === false))
        gMeme.lines[gMeme.selectedLineIdx].drag = isDrag
    return gMeme.lines[gMeme.selectedLineIdx].drag;
};

const setStickerDrag = (isDrag) => {
    if (isDrag || isDrag === false)
        gMeme.stickers[gMeme.selectedStickerIdx].drag = isDrag
    return gMeme.stickers[gMeme.selectedStickerIdx].drag;
};

const getFilteredImgs = filter => {
    return gImgs.filter(img => {
        let kws = img.keyWords
        if (kws.some((kw) => {
                return kw === filter
            }))
            return true
    })
}

const saveMeme = () => {
    let memeIdx = gSavedMemes.findIndex(meme => meme.id === gMeme.id);
    gIsDownloading = true;
    renderCanvas()
    gIsDownloading = false;
    let img = gElCanvas.toDataURL('image/jpeg', 0.5);
    gMeme.img = img
    if (memeIdx > -1)
        gSavedMemes[memeIdx] = gMeme;
    else
        gSavedMemes.push(gMeme)

    saveToStorage('memeDb', gSavedMemes)
    renderCanvas()
}

const loadSavedMemes = () => {
    gSavedMemes = loadFromStorage('memeDb')
    if (gSavedMemes === null) gSavedMemes = []
}

const deleteMeme = id => {
    gSavedMemes.splice(gSavedMemes.findIndex(meme => id === +meme.id), 1)
    saveToStorage('memeDb', gSavedMemes)
    renderSavedMemes();
}

const addSticker = (name) => {
    gMeme.stickers.push({
        id: makeId(),
        name,
        drag: false,
        pos: {
            x: (gElCanvas.width - 150 )/2,
            y: (gElCanvas.width - 150 )/2
        }
    })
    renderCanvas()
}