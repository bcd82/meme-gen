'use strict'

const onInit = () => {
    console.log('init...')
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
    document.querySelector('.gallery').innerHTML =strHTMLs.join('');
}

const onClickImg = (id) =>{
    console.log(`img #${id} clicked`)
    setMeme(id);
}

const onChangeText = (val) => {
    changeText(val)
}