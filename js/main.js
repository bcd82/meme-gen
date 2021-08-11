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
    document.querySelector('input[type=text]').value = gMeme.lines[0].txt;
}

const onChangeText = (val) => {
    changeText(val)

}

const onAddText = () => {
    addText();
    setInputVal()
}
const onSwitchText = () => {
    switchText();
    setInputVal()
}
const onDeleteText = () => {
    deleteText()
}

const setInputVal = () => {
    let val = document.querySelector('input[type=text]').value;
    if (gMeme.lines.length == 1 ) return;
    val = gMeme.lines[gMeme.selectedLineIdx].txt;
}