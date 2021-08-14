'use strict'

let gCurrLang = 'en';

const gTrans = {
    gallery: {
        en: 'gallery',
        he: 'גלריה',
    },
    memes: {
        en: 'memes',
        he: 'מימים',
    },
    about: {
        en: 'about',
        he: 'אני',
    },
    save: {
        en: 'save',
        he: 'שמירה',
    },
    share: {
        en: 'share',
        he: 'שיתוף',
    },
    'my-name': {
        en: 'Barak Sidi',
        he: 'ברק סידי',
    },
    'my-desc': {
        en: 'Full Stack Ninja',
        he: 'נינג\'ת פול סטאק',
    },
    search: {
        en: 'Enter search keyword',
        he: 'חיפוש לפי מילות מפתח',
    },
    'no-images': {
        en: 'no images found 😔',
        he: '😔 לא נמצאו תמונות ',
    },
    'no-saved': {
        en: 'no saved memes found 😔',
        he: '😔 לא נמצאו ממים שמורים ',
    },
    more: {
        en: 'more...',
        he: '...עוד',
    },
    less: {
        en: 'less',
        he: 'פחות',
    }
}

const toggleTransLang = () => {
    gCurrLang === 'en' ? gCurrLang = 'he' : gCurrLang = 'en';
}

const getTrans = transKey => {
    var keyTrans = gTrans[transKey]
    // if key doesn't exist
    if (!keyTrans) return 'does not exist'
    //get translation from key
    var txt = keyTrans[gCurrLang]
    // if no translation use english
    if (!txt) txt = keyTrans['en']

    return txt
}

const setLang = lang => gCurrLang = lang

const getCurrLang = () => gCurrLang;