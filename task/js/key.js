import create from './create.js';

export default class Key {
  constructor({ small, shift, code }) {
    this.code = code;
    this.shift = shift;
    this.small = small;
    this.isFnKey = Boolean(small.match(/Enter|CapsLock|arr|Ctrl|Shift|Tab|Back|Del|Win/));
    if (shift && shift.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/)) {
      this.sub = create('div', 'sim', this.shift);
    } else {
      this.sub = create('div', 'sim', '');
    }
    this.letter = create('div', 'letter', small);
    this.div = create('div', 'keyboard_key', [this.sub, this.letter], null, ['code', this.code]);
  }
}
