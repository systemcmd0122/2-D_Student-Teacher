const Input = {
  keys: {},

  init() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      // スペース・Enterのスクロール防止
      if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  },

  isPressed(code) {
    return !!this.keys[code];
  },

  consume(code) {
    const v = !!this.keys[code];
    this.keys[code] = false;
    return v;
  }
};