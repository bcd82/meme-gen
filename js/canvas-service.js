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
        let x = line.pos.x ;
        let rectDiff = 0;
        let width = gCtx.measureText(line.txt).width
        if(line.align === 'center') {
            x = 250;
            rectDiff = -width/2
        }else if (line.align === 'right'){
            x = 545
            rectDiff = -width
        }
        if (idx === memes.selectedLineIdx) {
            gCtx.fillStyle = 'red';
            gCtx.fillRect(x + rectDiff, line.pos.y + line.size * 0.15, width, 5);
            gCtx.fillRect(x + rectDiff, line.pos.y - line.size, width, 5);
        }
        gCtx.textAlign = line.align;
        gCtx.fillStyle = line.color;
        gCtx.fillSize = line.size;
        gCtx.lineWidth = 8;
        if (line.stroke)
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