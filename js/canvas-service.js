'use strict'
let gElCanvas;
let gCtx;
let gImg;
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
    renderTexts();
}
const renderTexts = () => {
    const memes = getMeme();
    const lines = memes.lines;
    lines.forEach((line, idx) => {
        gCtx.font = `${line.size}px ${line.font}`;
        let rectDiff = 0;
        let width = gCtx.measureText(line.txt).width
        let x = line.pos.x;
        setLineWidth(width)
        
        if (line.align === 'center') {
            x = gElCanvas.width /2 ;
            rectDiff = -width / 2
        } else if (line.align === 'right') {
            x = gElCanvas.width -5
            rectDiff = -width
        }
        if (idx === memes.selectedLineIdx) {
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
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: (ev.pageY - ev.target.offsetTop - ev.target.clientTop) -70
        }
    }
    return pos
}

const onDown = ev => {
    if (getMeme().lines.length < 1 || !getSelectedLine()) return;
    const pos = getEvPos(ev);
    let lineIdx = getClickedLineIdx(pos)
    if (lineIdx > -1) { 
        switchText(lineIdx)
        setIsDrag(true)
    }
}
const onMove = ev => {
    const pos = getEvPos(ev);
    if(setIsDrag()){
        dragLine(pos)
    }
}

const onUp = () => {
    setIsDrag(false)
}

const dragLine = (pos) => {
    let line = getSelectedLine()
    line.pos.y = pos.y;
    renderCanvas()
}

const getClickedLineIdx = (pos) => {
    let lines = getMeme().lines
    let clickedLineIdx;
    lines.forEach((line ,idx) => {
        let adjustedX = line.pos.x;
        let adjustedWidth = line.width;
        if (line.align === 'center') {
            adjustedX = line.pos.x + gElCanvas.width /2;
            adjustedWidth = line.width /2;
        }
        if (line.align === 'right') {
            adjustedX = line.pos.x + gElCanvas.width -5;
        }
        if ((pos.x >= (adjustedX - adjustedWidth)) && (pos.x <= (adjustedX + adjustedWidth )) &&
                (pos.y <= line.pos.y && pos.y >= line.pos.y - line.size)) {
                clickedLineIdx = idx;
            }
    })
    return clickedLineIdx;
}