'use strict'

const onInit = () => {
    createImgs()
    renderImgs()
    canvasInit()
    addListeners()
    memeInit()
    renderWords()

}

const renderImgs = () => {
    // let imgsToRender = gImgs;
    let strHTMLs = []
    let imgs = gImgs
    if (gFilterBy && gFilterBy !== 'all') {
        imgs = getFilteredImgs(gFilterBy)
    }
    if (!imgs || !imgs.length || imgs === null) {
        strHTMLs[0] = `<h2> no images found 😔 </h2>`
    } else {
        strHTMLs = imgs.map((img) => {
            return `        
                    <div class="meme-card" onclick="onClickImg(${img.id})">
                    <img src="./imgs/square/${img.id}.jpg" />
                    </div>`
        })
    }
    document.querySelector('.gallery').innerHTML = strHTMLs.join('');
}
const renderSavedMemes = () => {
    let memes = gSavedMemes;
    let strHTMLs = []
    if (!memes || !memes.length || memes === null) {
        strHTMLs[0] = `<h2> no images found 😔 </h2>`
    } else {
        strHTMLs = memes.map((meme) => {
            return `        
                    <div class="meme-card" onclick="onClickSavedMeme(${meme.id},true)">
                    <img src="./imgs/square/${meme.selectedImgId}.jpg" />
                    </div>`
        })
    }
    document.querySelector('.gallery').innerHTML = strHTMLs.join('');
}

const renderWords = () => {
    const words = getKeywordMap()
    const strHTMLs = ['<p class="active" onclick="onFilterByWord(this)" style="font-size:30px">all</p>']
    for (const key in words) {
        strHTMLs.push(`
        <p onclick="onFilterByWord(this)" style="font-size:${16 + (words[key] * 2)}px">${key}</p>`)
    }
    document.querySelector('.keywords').innerHTML = strHTMLs.join('');
}
const onClickImg = id => {
    setMeme(id);
    let meme = getMeme()
    document.querySelector('input[type=text]').value = meme.lines[0].txt;
    document.querySelector('body').classList.add('editor-open')
}
const onClickSavedMeme = id => {
    setMeme(id, true);
    let meme = getMeme()
    document.querySelector('input[type=text]').value = meme.lines[0].txt;
    document.querySelector('body').classList.add('editor-open')
}

const onChangeText = str => {
    changeText(str)
    let meme = getMeme()
    document.querySelector('input[type=text]').value = meme.lines[gMeme.selectedLineIdx].txt;
}

const onAddLine = () => {
    addLine();
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
const renderInput = () => {
    document.querySelector('input[type=text]').value = meme.lines[gMeme.selectedLineIdx].txt;
}
const onDeleteText = () => {
    deleteText()
}

const onFontResize = diff => {
    resizeFont(diff)
}

const onChangeFont = font => changeFont(font)

const onChangeColor = color => {
    changeColor(color)
    renderCanvas()
}

const onChangeStroke = color => changeStroke(color)

const onSwitchAlign = (alignTo) => switchAlign(alignTo)

const onGalleryClick = (el) => {
    document.querySelector('body').classList.remove('editor-open')
    document.querySelectorAll('ul li a').forEach((el) => el.classList.remove('active'))
    el.classList.add('active')
    renderImgs()
}

const onFilterByWord = (elWord) => {
    let fontSize = +elWord.style.fontSize.replace(/\D/g, '');
    elWord.style.fontSize = `${fontSize + 1}px `
    document.querySelectorAll('.keywords p').forEach((p) => p.classList.remove('active'))
    elWord.classList.add('active')
    const word = elWord.textContent;
    setFilter(word);
    renderImgs()
}

const onSearchFilter = str => {
    document.querySelectorAll('.keywords p').forEach((p) => p.classList.remove('active'))
    setFilter(str)
    renderImgs()
}
const onSaveMeme = () => {
    saveMeme()
    loadSavedMemes()
    renderSavedMemes()
}
const onShowSavedMemes = (el) => {
    document.querySelector('body').classList.remove('editor-open')
    document.querySelectorAll('ul li a').forEach((el) => el.classList.remove('active'))
    el.classList.add('active')
    renderSavedMemes(gSavedMemes)
}
const onToggleShare = () => { 
    document.querySelector('body').classList.toggle('show-share-menu');
}
const closeScreen = () => { 
    document.querySelector('body').classList.remove('show-share-menu')
}
const onDownloadCanvas = (el) => {
    downloadCanvas(el)
}