'use strict'
let gElCanvas;
let gCtx;
let gImg;

const canvasInit = () => {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    // addListeners()
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
        renderTexts()
        saveCanvas()
    ;
}
const renderTexts = () => {
    const lines = gMeme.lines;
    lines.forEach((line)=> {
        gCtx.font = `${line.size}px ${line.font}`;
        gCtx.fillStyle = line.color;
        gCtx.fillSize = line.size;
        gCtx.lineWidth = 8;
        gCtx.textAlign = line.align;
        gCtx.strokeText(line.txt, line.pos.x, line.pos.y);
        gCtx.fillText(line.txt, line.pos.x, line.pos.y);
        console.log(line.txt)

    })
}
const saveCanvas = () => {
    gCtx.save()
}
const restoreCanvas = () => {
    gCtx.restore()
}