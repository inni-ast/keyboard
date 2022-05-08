import create from './create.js';
import language from './index.js'; // by, en
import Key from './key.js';

const body = document.querySelector('body');
body.classList.add('body');

let lang = 'by';

function setLocalStorage() {
    localStorage.setItem('lang', lang);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
    if (localStorage.getItem('lang')) {
        lang = localStorage.getItem('lang');
    }
}
window.addEventListener('load', getLocalStorage);

const rowsOrder = [
    ['Backquote', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'Backspace'],
    ['Tab', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'Backslash'],
    ['CapsLock', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Enter'],
    ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ArrowUp', 'ShiftRight'],
    ['ControlLeft', 'Win', 'AltLeft', 'Space', 'AltRight', 'ControlRight', 'ArrowLeft', 'ArrowDown', 'ArrowRight'],
];

const main = create(
    'main',
    'wrapper',
    [create('h1', 'title', 'Віртуальная клавіятура'),
    create('h3', 'subtitle', 'Клавіятура распрацавана ў аперацыйнай сістэме Windows'),
    create('p', 'description', 'Для змены раскладкі выкарыстоўвай Ctrl + Shift')],
);

class Keyboard {
    constructor() {
        this.rowsOrder = rowsOrder;
        this.keysPressed = {}; // if (this.keysPressed[ShiftLeft]) - для проверки
        this.isCaps = false;
    }

    init() {
        this.keyBase = language[lang];
        this.output = create(
            'textarea',
            'textarea',
            null,
            main,
            ['placeholder', 'Прывітанне! Надрукуйце Ваша паведамленне...'],
            ['rows', 8],
            ['cols', 80],
            ['spellcheck', false],
        );
        this.container = create('div', 'keyboard', null, main, ['language', lang]);
        document.body.prepend(main);
        return this;
    }

    generateLayout() {
        this.keyButtons = []; // здесь кнопки
        this.rowsOrder.forEach((row, i) => {
            const rowElement = create('div', 'keyboard__row', null, this.container, ['row', i + 1]);
            row.forEach((code) => { // пришел код кнопки, получить нужно из KeyBase
                const keyObj = this.keyBase.find((key) => key.code === code);

                if (keyObj) {
                    const keyButton = new Key(keyObj);
                    this.keyButtons.push(keyButton);
                    rowElement.appendChild(keyButton.div);
                }
            });
        });
    }
}
getLocalStorage();
new Keyboard(rowsOrder).init(lang).generateLayout();
const textarea = document.querySelector('textarea');
const allKeys = document.querySelectorAll('.keyboard_key');

// перерисовка клавиш при смене языка
document.onkeydown = function (evt) {
    if (evt.code === 'ShiftLeft' || evt.code === 'ShiftRight') {
        document.onkeyup = function (event) {
            if ((event.code === 'ControlLeft' || event.code === 'ControlRight') && lang === 'by') {
                getLocalStorage();
                lang = 'en';
                allKeys.forEach((el) => {
                    const letter = document.querySelector(`.keyboard_key[data-code=${el.dataset.code}] .letter`);
                    for (let i = 0; i < language[lang].length; i++) {
                        if (language[lang][i].code === el.dataset.code) {
                            letter.innerHTML = language[lang][i].small;
                        }
                    }
                    setLocalStorage();
                });
            } else if ((event.code === 'ControlLeft' || event.code === 'ControlRight') && lang === 'en') {
                getLocalStorage();
                lang = 'by';

                allKeys.forEach((el) => {
                    const letter = document.querySelector(`.keyboard_key[data-code=${el.dataset.code}] .letter`);
                    for (let i = 0; i < language[lang].length; i++) {
                        if (language[lang][i].code === el.dataset.code) {
                            letter.innerHTML = language[lang][i].small;
                        }
                    }
                });
                setLocalStorage();
            }
        };
    }
};

// клавиши физической клавиатуры

document.addEventListener('keydown', (event) => {
    textarea.focus();
    allKeys.forEach((el) => {
        const key = event.code;
        if (!key.match(/Arrow|Enter|Backspace|Space|Delete|F12/)) {
            event.preventDefault();
        }
        if (el.dataset.code === key) {
            el.classList.add('active_key');
            setTimeout(() => el.classList.remove('active_key'), 1300);
        }
    });
    let currentKey;
    for (let i = 0; i < language[lang].length; i++) {
        if (language[lang][i].code === event.code) {
            currentKey = language[lang][i];
        }
    }
    if (currentKey.code.match(/Key|Digit|Backquote|Minus|Equal|BracketLeft|BracketRight|Backslash|Semicolon|Quote|Comma|Period|Slash/) && event.getModifierState('CapsLock')) {
        textarea.value += currentKey.shift;
    } else if (currentKey.code.match(/Key|Digit|Backquote|Minus|Equal|BracketLeft|BracketRight|Backslash|Semicolon|Quote|Comma|Period|Slash/) && event.shiftKey) {
        textarea.value += currentKey.shift;
    } else if (currentKey.code.match(/Key|Digit|Backquote|Minus|Equal|BracketLeft|BracketRight|Backslash|Semicolon|Quote|Comma|Period|Slash/)) {
        textarea.value += currentKey.small;
    } else if (currentKey.code === 'Tab') {
        textarea.value += '    ';
    }
});
// шифт на клаве и буква на витруальной
let shift = false;
let caps = false;
document.addEventListener('keydown', (event) => {
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
        shift = true;
    }
});
document.addEventListener('keyup', (event) => {
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
        shift = false;
    }
});

// клавиши на экране

allKeys.forEach((el) => {
    el.addEventListener('click', () => {
        textarea.focus();
        el.classList.add('active_key');
        setTimeout(() => el.classList.remove('active_key'), 1300);
        let currentKey;
        for (let i = 0; i < language[lang].length; i++) {
            if (language[lang][i].code === el.dataset.code) {
                currentKey = language[lang][i];
            }
        }
        if (currentKey.code === 'Tab') {
            textarea.value += '     ';
        }
        if (currentKey.code === 'Space') {
            textarea.value += ' ';
        }
        if (currentKey.code === 'ArrowUp') {
            textarea.value += '↑';
        }
        if (currentKey.code === 'ArrowDown') {
            textarea.value += '↓';
        }
        if (currentKey.code === 'ArrowRight') {
            textarea.value += '→';
        }
        if (currentKey.code === 'ArrowLeft') {
            textarea.value += '←';
        }
        if (currentKey.code === 'Enter') {
            textarea.value += '\n';
        }
        if (currentKey.code === 'Backspace') {
            const str = textarea.value.slice(0, -1);
            textarea.value = str;
        }
        if (currentKey.code.match(/Key|Digit|Backquote|Minus|Equal|BracketLeft|BracketRight|Backslash|Semicolon|Quote|Comma|Period|Slash/) && shift) {
            textarea.value += currentKey.shift;
            shift = false;
        } else if (currentKey.code.match(/Key|Digit|Backquote|Minus|Equal|BracketLeft|BracketRight|Backslash|Semicolon|Quote|Comma|Period|Slash/) && caps) {
            textarea.value += currentKey.shift;
        } else if (currentKey.code.match(/Key|Digit|Backquote|Minus|Equal|BracketLeft|BracketRight|Backslash|Semicolon|Quote|Comma|Period|Slash/) && !shift) {
            textarea.value += currentKey.small;
            shift = false;
        }
    });
});

const capsLock = document.querySelector('.keyboard_key[data-code=\'CapsLock\']');
capsLock.addEventListener('click', () => {
    capsLock.classList.toggle('active');
    if (caps) {
        caps = false;
    } else {
        caps = true;
    }
});
