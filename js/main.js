'use strict'

const onInit = () => {
    createImgs()
    renderImgs()
    canvasInit()
    memeInit()

}

const renderImgs = () => {
    const strHTMLs = gImgs.map((img) => {
        return `        
            <div class="meme-card" onclick="onClickImg(${img.id})">
            <img src="./imgs/square/${img.id}.jpg" />
            </div>`
    })
    document.querySelector('.gallery').innerHTML = strHTMLs.join('');
}

const onClickImg = (id) => {
    setMeme(id);
    let meme = getMeme()
    document.querySelector('input[type=text]').value = meme.lines[0].txt;
}

const onChangeText = (val) => {    
    changeText(val)
    let meme = getMeme()
    document.querySelector('input[type=text]').value = meme.lines[gMeme.selectedLineIdx].txt;

}

const onAddText = () => {
    addText();
    let meme = getMeme()
    document.querySelector('input[type=text]').value = meme.lines[gMeme.selectedLineIdx].txt;
}
const onSwitchText = () => {
    let meme = getMeme()
    if(!meme.lines.length) return
    switchText();
    document.querySelector('input[type=text]').value = meme.lines[gMeme.selectedLineIdx].txt;
}
const onDeleteText = () => {
    deleteText()
}
const onFontResize = (diff) => {
    resizeFont(diff)
}
const onChangeFont = (font) => {
    changeFont(font)
}