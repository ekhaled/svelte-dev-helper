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

let cls = class{
  constructor() {
    this.refs = {};
    this._fragment = create_main_fragment();
    this._slotted = {};
    this.root = {};
    this.store = {};
  }
  customMethod() {}
  anotherCustomMethod() {}
  get() {}
  fire() {}
  observe() {}
  on() {}
  set() {}
  teardown() {}
  _recompute() {}
  _set() {}
  _mount() {}
  _unmount() {}
  destroy() {}
}

cls.preload = function(){

}

export default cls;