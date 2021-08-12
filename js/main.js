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
    let imgsToRender = gImgs;
    let strHTMLs = []
    if (gFilterBy) {
        imgsToRender = getFilteredImgs(gFilterBy)
    }
    if (!imgsToRender || !imgsToRender.length) {
        strHTMLs[0] = `<h2> no images found 😔 </h2>`
    } else {
        strHTMLs = imgsToRender.map((img) => {
            return `        
                    <div class="meme-card" onclick="onClickImg(${img.id})">
                    <img src="./imgs/square/${img.id}.jpg" />
                    </div>`
        })
    }
    document.querySelector('.gallery').innerHTML = strHTMLs.join('');
}


const renderWords = () => {
    const words = getKeywordMap()
    const strHTMLs = []
    for (const key in words) {
        strHTMLs.push(`
        <p onclick="onFilterByWord(this)" style="font-size:${16 + (words[key] * 2)}px">${key}</p>
        `)
    }
    document.querySelector('.keywords').innerHTML = strHTMLs.join('');
}
const onClickImg = id => {
    setMeme(id);
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

const onCloseEditor = () => {
    document.querySelector('body').classList.remove('editor-open')
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