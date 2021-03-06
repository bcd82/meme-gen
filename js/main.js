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
    let imgs = getImgs()
    let strHTMLs = []
    if (gFilterBy && gFilterBy !== 'all')
        imgs = getFilteredImgs(gFilterBy)
    if (!imgs || !imgs.length || imgs === null) {
        strHTMLs[0] = `<h2 data-trans="no-images"> no images found 😔 </h2>`
    } else {
        strHTMLs = imgs.map((img) => {
            return `        
                    <div class="meme-card" onclick="onClickImg(${img.id})">
                    <img src="./imgs/square/${img.id}.jpg" />
                    </div>`
        })
    }
    document.querySelector('.gallery').innerHTML = strHTMLs.join('');
    doTrans()
}

const renderSavedMemes = () => {
    let memes = gSavedMemes;
    let strHTMLs = []
    if (!memes || !memes.length || memes === null) {
        strHTMLs[0] = `<h2 data-trans="no-saved"> no saved memes found 😔 save some memes !</h2>`
    } else {
        strHTMLs = memes.map((meme) => {
            return `        
                    <div class="meme-card" onclick="onClickSavedMeme(${meme.id})">
                    <img src="${meme.img}" />
                    <img  class="saved-meme-delete" onclick="onDeleteMeme(event,${meme.id})" 
                    src="./imgs/icons/trash.png" alt="">
                    </div>`
        })
    }
    document.querySelector('.gallery').innerHTML = strHTMLs.join('');
    doTrans()
}

const renderWords = () => {
    const words = getKeywordMap()
    const strHTMLs = [`<p> 
                        <span class="active" onclick="onFilterByWord(this)" style="font-size:30px">all</span>`]
    for (const key in words) {
        strHTMLs.push(`
         <span onclick="onFilterByWord(this)" style="font-size:${23 + (words[key] * 2)}px">${key}</span>`)
    }
    strHTMLs.push('</p>')
    document.querySelector('.keywords').innerHTML = strHTMLs.join('');
    doTrans()

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
    if (meme.lines.length > 0)
        document.querySelector('input[type=text]').value = meme.lines[0].txt;
    document.querySelector('body').classList.add('editor-open')
}

const onChangeLine = str => {
    changeLine(str)
    let meme = getMeme()
    renderInput(meme)
    renderCanvas()
}

const onAddLine = () => {
    addLine();
    const meme = getMeme()
    renderInput(meme)
    renderCanvas()
}

const onSwitchLine = () => {
    const meme = getMeme()
    if (!meme.lines.length) return
    switchLine();
    renderInput(meme)
    renderCanvas()
}

const renderInput = (meme) => {
    document.querySelector('input[type=text]').value = meme.lines[meme.selectedLineIdx].txt;
}

const onDelete = () => {
    document.querySelector('.bottom-modal').innerHTML = `
        <button onclick="onDeleteLine()" class="bottom-modal-btn">
            Delete Line
        </button>
        </a>
        <button class="bottom-modal-btn" onclick="onClearAll()">
            Clear All
        </button>`
    document.querySelector('body').classList.toggle('show-bottom-modal')
}

const onDeleteLine = () => {
    document.querySelector('body').classList.remove('show-bottom-modal')
    deleteLine()
    renderCanvas()
}

const onClearAll = () => {
    clearAll()
    renderCanvas()
    closeScreen()
}

const onFontResize = diff => {
    resizeFont(diff)
    renderCanvas()
}

const onChangeFont = font => {
    changeFont(font)
    renderCanvas()
    renderCanvas()
}

const onChangeColor = color => {
    changeColor(color)
    renderCanvas()
}

const onChangeStroke = color => {
    changeStroke(color)
    renderCanvas()
}

const onSwitchAlign = alignTo => {
    switchAlign(alignTo)
    renderCanvas()
}

const onGalleryClick = el => {
    document.querySelector('body').classList.remove('editor-open')
    document.querySelectorAll('ul li a').forEach((el) => el.classList.remove('active'))
    el.classList.add('active')
    closeScreen()
    renderImgs()
}

const onFilterByWord = elWord => {
    let fontSize = +elWord.style.fontSize.replace(/\D/g, '');
    elWord.style.fontSize = `${fontSize + 1}px `
    document.querySelectorAll('.keywords span').forEach((p) => p.classList.remove('active'))
    document.querySelector('ul li a.active').classList.remove('active')
    document.querySelector('ul li a:first-of-type').classList.add('active')
    elWord.classList.add('active')
    const word = elWord.textContent;
    setFilter(word);
    document.querySelector('.top-bar').classList.remove('show');
    document.querySelector('.more-kw').setAttribute('data-trans', 'more')
    renderImgs()
    doTrans()
}

const onSearchFilter = str => {
    document.querySelectorAll('.keywords p span').forEach((el) => {
        el.classList.remove('active')
        if(el.innerText === str.toLowerCase())
        el.classList.add('active')
    })
    setFilter(str)
    renderImgs()
}
const onSaveMeme = () => {
    saveMeme()
    renderSavedMemes()
    document.querySelectorAll('ul li a').forEach((el) => el.classList.remove('active'))
    document.querySelector('ul li:nth-of-type(2) a').classList.add('active')
    document.querySelector('body').classList.remove('editor-open')
}

const onShowSavedMemes = el => {
    document.querySelector('body').classList.remove('editor-open')
    document.querySelectorAll('ul li a').forEach((el) => el.classList.remove('active'))
    el.classList.add('active')
    renderSavedMemes(gSavedMemes)
    closeScreen()
}

const onToggleShare = () => {
    document.querySelector('.bottom-modal').innerHTML = `
        <a href="#" onclick="onDownloadCanvas(this)" download="myMeme">
            <button class="bottom-modal-btn">
                <img src="./imgs/icons/download.png" alt="">
            </button>
        </a>
        <button class="bottom-modal-btn" onclick="onClickShare()">
            <img src="./imgs/icons/share.png" alt="">
        </button>`
    document.querySelector('body').classList.toggle('show-bottom-modal')
};

const closeScreen = () => {
    document.querySelector('body').classList.remove('show-bottom-modal')
    document.querySelector('body').classList.remove('show-menu')
    document.querySelector('body').classList.remove('show-stickers')
}

const onDownloadCanvas = (el) => downloadCanvas(el)


const onToggleMenu = () => {
    let el = document.querySelector('body')
    document.querySelectorAll('.mobile-meny-btn')
    el.classList.toggle('show-menu')
}

const onClickShare = () => {
    gIsDownloading = true;
    renderCanvas();
    clickShare()
    gIsDownloading = false;
}
const onResizeCanvas = () => {
    resizeCanvas()
    if (document.querySelector('body').classList.contains('editor-open'))
        renderCanvas()
}

const onDeleteMeme = (event, id) => {
    event.stopPropagation();
    deleteMeme(id)
    renderSavedMemes();
}

const onAddSticker = stickerName => {
    addSticker(stickerName)
    closeScreen()
    renderCanvas()
}

const onShowStickers = () => {
    document.querySelector('body').classList.toggle('show-stickers');
}

const onShowMore = el => {
    if (el.dataset.trans === 'more') {
        el.setAttribute('data-trans', 'less')
    } else {
        el.setAttribute('data-trans', 'more')
    }
    document.querySelector('.top-bar').classList.toggle('show');
    doTrans()

}

const onDoTrans = () => {
    toggleTransLang()
    doTrans()
}
const doTrans = () => {
    const els = document.querySelectorAll('[data-trans]');
    els.forEach((el) => {
        let txt = getTrans(el.dataset.trans)
        if (el.nodeName === 'INPUT') {
            el.setAttribute('placeholder', txt)
        } else {
            el.innerText = txt
        }
    })
}