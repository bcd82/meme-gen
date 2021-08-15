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
        selectedStickerIdx: -1,
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
                x: getCanvas().width / 2,
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

const changeLine = (val) => {
    gMeme.lines[gMeme.selectedLineIdx].txt = val;
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
            x: getCanvas().width / 2,
            y: 100
        },
        drag: false,
    }

    if (gMeme.lines.length === 1)
        newLine.pos.y = getCanvas().height - 50;
    if (gMeme.lines.length >= 2)
        newLine.pos.y = getCanvas().height / 2;

    gMeme.selectedLineIdx++;
    gMeme.lines.push(newLine)
}

const switchLine = (idx) => {
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
}

const deleteLine = () => {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    if (!gMeme.lines.length)
        gMeme.selectedLineIdx = -1;
    else
        gMeme.selectedLineIdx = 0;
}

const resizeFont = diff => {
    gMeme.lines[gMeme.selectedLineIdx].size += diff;
}

const changeFont = font => {
    gMeme.lines[gMeme.selectedLineIdx].font = font;
}

const changeColor = color =>  gMeme.lines[gMeme.selectedLineIdx].color = color;

const changeStroke = (color) => {
    gMeme.lines[gMeme.selectedLineIdx].strokeClr = color;
}

const switchAlign = alignTo => {
    let line = gMeme.lines[gMeme.selectedLineIdx]
    line.align = alignTo
    if (line.align === 'center') {
        line.pos.x = getCanvas().width / 2;

    } else if (line.align === 'right') {
        line.pos.x = getCanvas().width
    } else {
        line.pos.x = 0
    }
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
    const memeIdx = gSavedMemes.findIndex(meme => meme.id === gMeme.id);
    gIsDownloading = true;
    renderCanvas()
    gIsDownloading = false;
    const img = getCanvas().toDataURL('image/jpeg', 0.2);
    gMeme.img = img
    if (memeIdx > -1)
        gSavedMemes[memeIdx] = gMeme;
    else
        gSavedMemes.push(gMeme)

    saveToStorage('memeDb', gSavedMemes)
}

const loadSavedMemes = () => {
    gSavedMemes = loadFromStorage('memeDb')
    if (gSavedMemes === null) gSavedMemes = []
}

const deleteMeme = id => {
    gSavedMemes.splice(gSavedMemes.findIndex(meme => id === +meme.id), 1)
    saveToStorage('memeDb', gSavedMemes)
}

const addSticker = (name) => {
    gMeme.stickers.push({
        id: makeId(),
        name,
        drag: false,
        pos: {
            x: (getCanvas().width - 150) / 2,
            y: (getCanvas().width - 150) / 2
        }
    })
}

const dragLine = pos => {
    let line = getSelectedLine()
    line.pos.y = pos.y + line.size / 2;
    let x = pos.x;
    if (line.align === 'left') {
        x = pos.x - line.width / 2
    }
    if (line.align === 'right') {
        x = pos.x + line.width / 2
    }
    line.pos.x = x;
    renderCanvas()
}

const dragSticker = (pos) => {
    let sticker = gMeme.stickers[gMeme.selectedStickerIdx]
    sticker.pos.x = pos.x - 75;
    sticker.pos.y = pos.y - 75;
    renderCanvas()
}

const getClickedLineIdx = (pos) => {
    let lines = gMeme.lines
    let clickedLineIdx;
    lines.forEach((line, idx) => {
        if ((pos.x >= (line.pos.x - line.width)) && (pos.x <= (line.pos.x + line.width)) &&
            (pos.y <= line.pos.y && pos.y >= line.pos.y - line.size)) {
            clickedLineIdx = idx;
        }
    })
    return clickedLineIdx;
}

const getClickedStickerIdx = (pos) => {
    let stickers = gMeme.stickers
    let clickedStickerId;
    stickers.forEach((sticker, idx) => {
        if ((pos.x >= sticker.pos.x) && (pos.x <= (sticker.pos.x + 150)) &&
            ((pos.y <= sticker.pos.y + 150) && (pos.y >= sticker.pos.y))) {
            clickedStickerId = idx;
        }
    })
    return clickedStickerId;
}