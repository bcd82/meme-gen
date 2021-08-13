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
    closeScreen()
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
    closeScreen()
}
const onToggleShare = () => {
    document.querySelector('body').classList.toggle('show-share-menu');
}

const closeScreen = () => {
    document.querySelector('body').classList.remove('show-share-menu')
    document.querySelector('body').classList.remove('show-menu')
}

const onDownloadCanvas = (el) => {
    downloadCanvas(el)
}

const onToggleMenu = (it) => {
    let el = document.querySelector('body')
    console.log(it)
    document.querySelectorAll('.mobile-meny-btn')
    el.classList.toggle('show-menu')
}

const dataURItoBlob = (dataURI) => {
    let byteString = atob(dataURI.split(',')[1]);
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {
        type: 'image/jpeg'
    });
}

const upload = async (response, page_token) => {
    let canvas = document.getElementById('canvas');
    let dataURL = canvas.toDataURL('image/jpeg', 1.0);
    let blob = dataURItoBlob(dataURL);
    let formData = new FormData();
    formData.append('access_token', response.authResponse.accessToken);
    formData.append('source', blob);

    let responseFB = await fetch(`https://graph.facebook.com/me/photos?access_token=${page_token}`, {
        body: formData,
        method: 'post'
    });
    responseFB = await responseFB.json();
    console.log(responseFB);
};

async function clickShare()  {
    gIsDownloading = true;
    const dataUrl = gElCanvas.toDataURL();
    const blob = await (await fetch(dataUrl)).blob();
    const filesArray = [
        new File(
            [blob],
            'animation.png', {
                type: blob.type,
                lastModified: new Date().getTime()
            }
        )
    ];
    gIsDownloading = false;

    const shareData = {
        files: filesArray,
    };
    navigator.share(shareData);

}