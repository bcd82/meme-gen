'use strict'
let gElCanvas;
let gCtx;
let gImg;

const canvasInit = () => {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    // addListeners()
}

// const resizeCanvas = () => {
//     const elContainer = document.querySelector('.canvas-container')
//     gElCanvas.width = elContainer.offsetWidth
//     gElCanvas.height = elContainer.offsetHeight
// }

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
        let x = line.pos.x;
        let rectDiff = 0;
        let width = gCtx.measureText(line.txt).width
        if (line.align === 'center') {
            x = 275;
            rectDiff = -width / 2
        } else if (line.align === 'right') {
            x = 545
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
        gCtx.strokeStyle = line.strokeClr;
        gCtx.lineWidth = 8;
        gCtx.strokeText(line.txt, x, line.pos.y);
        gCtx.fillText(line.txt, x, line.pos.y);
    })
}
// const saveCanvas = () => {
//     gCtx.save()
// }
// const restoreCanvas = () => {
//     gCtx.restore()
// }