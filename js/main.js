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
    document.querySelector('body').classList.add('editor-open')
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

const onMoveText = diff => { 
    moveText(diff)
}

const onSwitchText = () => {
    let meme = getMeme()
    if (!meme.lines.length) return
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

const onChangeColor = color => {
    changeColor(color)
    renderCanvas()
}

const onToggleStroke = () => toggleStroke()

const onSwitchAlign = (alignTo) => switchAlign(alignTo)

const onCloseEditor = () => { 
    document.querySelector('body').classList.remove('editor-open')
}