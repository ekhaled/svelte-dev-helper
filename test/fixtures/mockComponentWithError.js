function create_main_fragment() {
  return {
    c: function create() { },
    h: function hydrate() { },
    m: function mount() { },
    p: function update() { },
    u: function unmount() { },
    d: function destroy() { }
  }
}

export default class {
  constructor() {
    this._fragment = create_main_fragment();
    this._slotted = {};
    this.root = {};
    this.store = {};
    throw new Error("Something went wrong");
  }
  get() { }
  fire() { }
  observe() { }
  on() { }
  set() { }
  teardown() { }
  _recompute() { }
  _set() { }
  _mount() { }
  _unmount() { }
  destroy() { }
}