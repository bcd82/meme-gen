'use strict'
let gElCanvas;
let gCtx;

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
    image.onload = () => {
        gCtx.drawImage(image, 0, 0, gElCanvas.width, gElCanvas.height);
    }; 
    image.src = url;
}