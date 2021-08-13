'use strict'
let gElCanvas;
let gCtx;
let gImg;
let gIsDownloading = false;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

const canvasInit = () => {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
}

const resizeCanvas = () => {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}

const setMemeImg = url => {
    const image = new Image();
    image.src = url;
    gImg = image;
    renderCanvas()
}

const renderCanvas = () => {
    gCtx.drawImage(gImg, 0, 0, gElCanvas.width, gElCanvas.height);
    renderStickers()
    renderTexts();
}

const renderStickers = () => {
    const meme = getMeme()
    if (meme.stickers.length) {
        meme.stickers.forEach(sticker => {
            const image = new Image();
            image.src = `../imgs/stickers/${sticker.name}.png`;
            gCtx.drawImage(image, sticker.pos.x, sticker.pos.y,150,150);
        })
    }
}
const renderTexts = () => {
    const meme = getMeme();
    const lines = meme.lines;
    lines.forEach((line, idx) => {
        gCtx.font = `${line.size}px ${line.font}`;
        let rectDiff = 0;
        let width = gCtx.measureText(line.txt).width
        let x = line.pos.x;
        setLineWidth(width)

        if (line.align === 'center') {
            x = gElCanvas.width / 2;
            rectDiff = -width / 2
        } else if (line.align === 'right') {
            x = gElCanvas.width - 5
            rectDiff = -width
        }
        if (idx === meme.selectedLineIdx && !gIsDownloading) {
            gCtx.fillStyle = '#ff7f00';
            gCtx.fillRect(x + rectDiff, line.pos.y + line.size * 0.15, width, 8);
            gCtx.fillRect(x + rectDiff, line.pos.y - line.size, width, 8);
            gCtx.fillRect(x + rectDiff, line.pos.y - 10 - line.size, width, 5);
            gCtx.fillRect(x + rectDiff, line.pos.y + 10 + line.size * 0.2, width, 5);
        }
        gCtx.textAlign = line.align;
        gCtx.fillStyle = line.color;
        gCtx.fillSize = line.size;
        gCtx.lineJoin = 'round';
        gCtx.strokeStyle = line.strokeClr;
        gCtx.lineWidth = 8;
        gCtx.strokeText(line.txt, x, line.pos.y);
        gCtx.fillText(line.txt, x, line.pos.y);
    })
}

const addListeners = () => {
    addMouseListeners()
    addTouchListeners()
}
const addMouseListeners = () => {
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mouseup', onUp)
}

const addTouchListeners = () => {
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchend', onUp)
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        var source = ev.touches ? ev.touches[0] : ev;
        const {
            clientX,
            clientY
        } = source;
        const {
            left,
            top
        } = gElCanvas.getBoundingClientRect();

        const x = clientX - left;
        const y = clientY - top;

        return {
            x,
            y
        };
    }
    return pos
}

const onDown = ev => {
    const pos = getEvPos(ev);
    let stickerIdx = -1;
    if (getMeme().lines.length > 1 || getSelectedLine()) {
        let lineIdx = getClickedLineIdx(pos)
        if (lineIdx > -1) {
            switchText(lineIdx)
            setLineDrag(true)
        }
    }
    if (getMeme().stickers.length) {
        stickerIdx = getClickedStickerIdx(pos)
    }
    if (stickerIdx > -1) {
        gMeme.selectedStickerIdx = stickerIdx;
        setStickerDrag(true)
    }
}
const onMove = ev => {
    const pos = getEvPos(ev);
    if (setLineDrag()) {
        dragLine(pos)
    }
    if (getMeme.selectedStickerIdx  === -1 || !(getMeme().stickers[getMeme().selectedStickerIdx])) return
    if (!setStickerDrag()) return
        dragSticker(pos)
}

const onUp = () => {
    setLineDrag(false)
    console.log(getMeme().sel)
    if (getMeme().selectedStickerIdx === -1) return
    setStickerDrag(false)
    getMeme().selectedStickerIdx = -1
}

const dragLine = (pos) => {
    let line = getSelectedLine()
    line.pos.y = pos.y;
    renderCanvas()
}
const dragSticker = (pos) => {
    let sticker = getMeme().stickers[getMeme().selectedStickerIdx]
    sticker.pos = pos;

    renderCanvas()
}

const getClickedLineIdx = (pos) => {
    let lines = getMeme().lines
    let clickedLineIdx;
    lines.forEach((line, idx) => {
        let adjustedX = line.pos.x;
        let adjustedWidth = line.width;
        if (line.align === 'center') {
            adjustedX = line.pos.x + gElCanvas.width / 2;
            adjustedWidth = line.width / 2;
        }
        if (line.align === 'right') {
            adjustedX = line.pos.x + gElCanvas.width - 5;
        }
        if ((pos.x >= (adjustedX - adjustedWidth)) && (pos.x <= (adjustedX + adjustedWidth)) &&
            (pos.y <= line.pos.y && pos.y >= line.pos.y - line.size)) {
            clickedLineIdx = idx;
        }
    })
    return clickedLineIdx;
}
const getClickedStickerIdx = (pos) => {
    let stickers = getMeme().stickers
    let clickedStickerId;
    stickers.forEach((sticker, idx) => {
        if ((pos.x >= sticker.pos.x) && (pos.x <= (sticker.pos.x + 150)) &&
            ((pos.y <= sticker.pos.y + 150) && (pos.y >= sticker.pos.y))) {
            clickedStickerId = idx;
        }
    })
    return clickedStickerId;
}

const downloadCanvas = elLink => {
    gIsDownloading = true;
    renderCanvas()
    const data = gElCanvas.toDataURL('image/jpeg')
    elLink.href = data
    gIsDownloading = false;
    renderCanvas()

}

async function clickShare() {
    const dataUrl = gElCanvas.toDataURL();
    const blob = await (await fetch(dataUrl)).blob();
    const filesArray = [
        new File(
            [blob],
            'animation.png', {
                type: blob.type,
                lastModified: new Date().getTime()
            }
        )
    ];

    const shareData = {
        files: filesArray,
    };
    navigator.share(shareData);
}