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
    let strHTMLs = []
    let imgs = gImgs
    if (gFilterBy && gFilterBy !== 'all')
        imgs = getFilteredImgs(gFilterBy)

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
        strHTMLs[0] = `<h2> no saved memes found 😔 save some memes !</h2>`
    } else {
        strHTMLs = memes.map((meme) => {
            return `        
                    <div class="meme-card" onclick="onClickSavedMeme(${meme.id})">
                    <img src="${meme.img}" />
                    <img  class="saved-meme-delete" onclick="onDeleteMeme(event,${meme.id})" 
                    src="./imgs/ICONS/trash.png" alt="">
                    </div>`
        })
    }
    document.querySelector('.gallery').innerHTML = strHTMLs.join('');
}

const renderWords = () => {
    const words = getKeywordMap()
    const strHTMLs = [`<p> 
                        <span class="active" onclick="onFilterByWord(this)" style="font-size:30px">
                        all
                        </span>`]
    for (const key in words) {
        strHTMLs.push(`
         <span onclick="onFilterByWord(this)" style="font-size:${23 + (words[key] * 2)}px">${key}</span>`)
    }
    strHTMLs.push('</p>')
    strHTMLs.splice(6, 0, `<span class="more-kw" onclick="onShowMore(this)">more...</span><br>`)
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
    if (meme.lines.length > 0)
        document.querySelector('input[type=text]').value = meme.lines[0].txt;
    document.querySelector('body').classList.add('editor-open')
}

const onChangeText = str => {
    changeText(str)
    let meme = getMeme()
    renderInput(meme)
    renderCanvas()

}

const onAddLine = () => {
    addLine();
    let meme = getMeme()
    renderInput(meme)
    renderCanvas()
}

const onSwitchText = () => {
    let meme = getMeme()
    if (!meme.lines.length) return
    switchText();
    renderInput(meme)
    renderCanvas()
}

const renderInput = (meme) => {
    document.querySelector('input[type=text]').value = meme.lines[meme.selectedLineIdx].txt;
}

const onDeleteText = () => {
    deleteText()
    renderCanvas()
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
    renderImgs()
}

const onSearchFilter = str => {
    document.querySelectorAll('.keywords p').forEach((p) => p.classList.remove('active'))
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

const onToggleShare = () => document.querySelector('body').classList.toggle('show-share-menu');

const closeScreen = () => {
    document.querySelector('body').classList.remove('show-share-menu')
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
    if (el.innerText === 'more...')
        el.innerText = 'less';
    else
        el.innerText = 'more...';
    document.querySelector('.top-bar').classList.toggle('show');
}

const onDoTrans = () => {
    if (gCurrLang === 'en')
        gCurrLang = 'he';
        else 
            gCurrLang = 'en';
    const els = document.querySelectorAll('[data-trans]');
    els.forEach((el) => {
        let txt = getTrans(el.dataset.trans)
        if (el.nodeName === 'INPUT') {
            el.setAttribute('placeholder', txt)
        } else {
            el.innerText = txt
        }
    })
    document.querySelector('body').classList.toggle('rtl')
}