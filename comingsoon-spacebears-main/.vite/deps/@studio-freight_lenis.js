import "./chunk-PR4QN5HX.js";

// node_modules/@studio-freight/lenis/dist/lenis.mjs
function t(t2, e2, i) {
  return Math.max(t2, Math.min(e2, i));
}
var Animate = class {
  advance(e2) {
    if (!this.isRunning) return;
    let i = false;
    if (this.lerp) this.value = (s = this.value, o = this.to, n = 60 * this.lerp, r = e2, (function(t2, e3, i2) {
      return (1 - i2) * t2 + i2 * e3;
    })(s, o, 1 - Math.exp(-n * r))), Math.round(this.value) === this.to && (this.value = this.to, i = true);
    else {
      this.currentTime += e2;
      const s2 = t(0, this.currentTime / this.duration, 1);
      i = s2 >= 1;
      const o2 = i ? 1 : this.easing(s2);
      this.value = this.from + (this.to - this.from) * o2;
    }
    var s, o, n, r;
    this.onUpdate?.(this.value, i), i && this.stop();
  }
  stop() {
    this.isRunning = false;
  }
  fromTo(t2, e2, { lerp: i = 0.1, duration: s = 1, easing: o = ((t3) => t3), onStart: n, onUpdate: r }) {
    this.from = this.value = t2, this.to = e2, this.lerp = i, this.duration = s, this.easing = o, this.currentTime = 0, this.isRunning = true, n?.(), this.onUpdate = r;
  }
};
var Dimensions = class {
  constructor({ wrapper: t2, content: e2, autoResize: i = true, debounce: s = 250 } = {}) {
    this.wrapper = t2, this.content = e2, i && (this.debouncedResize = /* @__PURE__ */ (function(t3, e3) {
      let i2;
      return function() {
        let s2 = arguments, o = this;
        clearTimeout(i2), i2 = setTimeout((function() {
          t3.apply(o, s2);
        }), e3);
      };
    })(this.resize, s), this.wrapper === window ? window.addEventListener("resize", this.debouncedResize, false) : (this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize), this.wrapperResizeObserver.observe(this.wrapper)), this.contentResizeObserver = new ResizeObserver(this.debouncedResize), this.contentResizeObserver.observe(this.content)), this.resize();
  }
  destroy() {
    this.wrapperResizeObserver?.disconnect(), this.contentResizeObserver?.disconnect(), window.removeEventListener("resize", this.debouncedResize, false);
  }
  resize = () => {
    this.onWrapperResize(), this.onContentResize();
  };
  onWrapperResize = () => {
    this.wrapper === window ? (this.width = window.innerWidth, this.height = window.innerHeight) : (this.width = this.wrapper.clientWidth, this.height = this.wrapper.clientHeight);
  };
  onContentResize = () => {
    this.wrapper === window ? (this.scrollHeight = this.content.scrollHeight, this.scrollWidth = this.content.scrollWidth) : (this.scrollHeight = this.wrapper.scrollHeight, this.scrollWidth = this.wrapper.scrollWidth);
  };
  get limit() {
    return { x: this.scrollWidth - this.width, y: this.scrollHeight - this.height };
  }
};
var Emitter = class {
  constructor() {
    this.events = {};
  }
  emit(t2, ...e2) {
    let i = this.events[t2] || [];
    for (let t3 = 0, s = i.length; t3 < s; t3++) i[t3](...e2);
  }
  on(t2, e2) {
    return this.events[t2]?.push(e2) || (this.events[t2] = [e2]), () => {
      this.events[t2] = this.events[t2]?.filter(((t3) => e2 !== t3));
    };
  }
  off(t2, e2) {
    this.events[t2] = this.events[t2]?.filter(((t3) => e2 !== t3));
  }
  destroy() {
    this.events = {};
  }
};
var e = 100 / 6;
var VirtualScroll = class {
  constructor(t2, { wheelMultiplier: e2 = 1, touchMultiplier: i = 1 }) {
    this.element = t2, this.wheelMultiplier = e2, this.touchMultiplier = i, this.touchStart = { x: null, y: null }, this.emitter = new Emitter(), window.addEventListener("resize", this.onWindowResize, false), this.onWindowResize(), this.element.addEventListener("wheel", this.onWheel, { passive: false }), this.element.addEventListener("touchstart", this.onTouchStart, { passive: false }), this.element.addEventListener("touchmove", this.onTouchMove, { passive: false }), this.element.addEventListener("touchend", this.onTouchEnd, { passive: false });
  }
  on(t2, e2) {
    return this.emitter.on(t2, e2);
  }
  destroy() {
    this.emitter.destroy(), window.removeEventListener("resize", this.onWindowResize, false), this.element.removeEventListener("wheel", this.onWheel, { passive: false }), this.element.removeEventListener("touchstart", this.onTouchStart, { passive: false }), this.element.removeEventListener("touchmove", this.onTouchMove, { passive: false }), this.element.removeEventListener("touchend", this.onTouchEnd, { passive: false });
  }
  onTouchStart = (t2) => {
    const { clientX: e2, clientY: i } = t2.targetTouches ? t2.targetTouches[0] : t2;
    this.touchStart.x = e2, this.touchStart.y = i, this.lastDelta = { x: 0, y: 0 }, this.emitter.emit("scroll", { deltaX: 0, deltaY: 0, event: t2 });
  };
  onTouchMove = (t2) => {
    const { clientX: e2, clientY: i } = t2.targetTouches ? t2.targetTouches[0] : t2, s = -(e2 - this.touchStart.x) * this.touchMultiplier, o = -(i - this.touchStart.y) * this.touchMultiplier;
    this.touchStart.x = e2, this.touchStart.y = i, this.lastDelta = { x: s, y: o }, this.emitter.emit("scroll", { deltaX: s, deltaY: o, event: t2 });
  };
  onTouchEnd = (t2) => {
    this.emitter.emit("scroll", { deltaX: this.lastDelta.x, deltaY: this.lastDelta.y, event: t2 });
  };
  onWheel = (t2) => {
    let { deltaX: i, deltaY: s, deltaMode: o } = t2;
    i *= 1 === o ? e : 2 === o ? this.windowWidth : 1, s *= 1 === o ? e : 2 === o ? this.windowHeight : 1, i *= this.wheelMultiplier, s *= this.wheelMultiplier, this.emitter.emit("scroll", { deltaX: i, deltaY: s, event: t2 });
  };
  onWindowResize = () => {
    this.windowWidth = window.innerWidth, this.windowHeight = window.innerHeight;
  };
};
var Lenis = class {
  constructor({ wrapper: t2 = window, content: e2 = document.documentElement, wheelEventsTarget: i = t2, eventsTarget: s = i, smoothWheel: o = true, syncTouch: n = false, syncTouchLerp: r = 0.075, touchInertiaMultiplier: l = 35, duration: h, easing: a = ((t3) => Math.min(1, 1.001 - Math.pow(2, -10 * t3))), lerp: c = !h && 0.1, infinite: d = false, orientation: p = "vertical", gestureOrientation: u = "vertical", touchMultiplier: m = 1, wheelMultiplier: v = 1, autoResize: g = true, __experimental__naiveDimensions: S = false } = {}) {
    this.__isSmooth = false, this.__isScrolling = false, this.__isStopped = false, this.__isLocked = false, this.onVirtualScroll = ({ deltaX: t3, deltaY: e3, event: i2 }) => {
      if (i2.ctrlKey) return;
      const s2 = i2.type.includes("touch"), o2 = i2.type.includes("wheel");
      if (this.options.syncTouch && s2 && "touchstart" === i2.type && !this.isStopped && !this.isLocked) return void this.reset();
      const n2 = 0 === t3 && 0 === e3, r2 = "vertical" === this.options.gestureOrientation && 0 === e3 || "horizontal" === this.options.gestureOrientation && 0 === t3;
      if (n2 || r2) return;
      let l2 = i2.composedPath();
      if (l2 = l2.slice(0, l2.indexOf(this.rootElement)), l2.find(((t4) => {
        var e4, i3, n3, r3, l3;
        return (null === (e4 = t4.hasAttribute) || void 0 === e4 ? void 0 : e4.call(t4, "data-lenis-prevent")) || s2 && (null === (i3 = t4.hasAttribute) || void 0 === i3 ? void 0 : i3.call(t4, "data-lenis-prevent-touch")) || o2 && (null === (n3 = t4.hasAttribute) || void 0 === n3 ? void 0 : n3.call(t4, "data-lenis-prevent-wheel")) || (null === (r3 = t4.classList) || void 0 === r3 ? void 0 : r3.contains("lenis")) && !(null === (l3 = t4.classList) || void 0 === l3 ? void 0 : l3.contains("lenis-stopped"));
      }))) return;
      if (this.isStopped || this.isLocked) return void i2.preventDefault();
      if (this.isSmooth = this.options.syncTouch && s2 || this.options.smoothWheel && o2, !this.isSmooth) return this.isScrolling = false, void this.animate.stop();
      i2.preventDefault();
      let h2 = e3;
      "both" === this.options.gestureOrientation ? h2 = Math.abs(e3) > Math.abs(t3) ? e3 : t3 : "horizontal" === this.options.gestureOrientation && (h2 = t3);
      const a2 = s2 && this.options.syncTouch, c2 = s2 && "touchend" === i2.type && Math.abs(h2) > 5;
      c2 && (h2 = this.velocity * this.options.touchInertiaMultiplier), this.scrollTo(this.targetScroll + h2, Object.assign({ programmatic: false }, a2 ? { lerp: c2 ? this.options.syncTouchLerp : 1 } : { lerp: this.options.lerp, duration: this.options.duration, easing: this.options.easing }));
    }, this.onNativeScroll = () => {
      if (!this.__preventNextScrollEvent && !this.isScrolling) {
        const t3 = this.animatedScroll;
        this.animatedScroll = this.targetScroll = this.actualScroll, this.velocity = 0, this.direction = Math.sign(this.animatedScroll - t3), this.emit();
      }
    }, window.lenisVersion = "1.0.42", t2 !== document.documentElement && t2 !== document.body || (t2 = window), this.options = { wrapper: t2, content: e2, wheelEventsTarget: i, eventsTarget: s, smoothWheel: o, syncTouch: n, syncTouchLerp: r, touchInertiaMultiplier: l, duration: h, easing: a, lerp: c, infinite: d, gestureOrientation: u, orientation: p, touchMultiplier: m, wheelMultiplier: v, autoResize: g, __experimental__naiveDimensions: S }, this.animate = new Animate(), this.emitter = new Emitter(), this.dimensions = new Dimensions({ wrapper: t2, content: e2, autoResize: g }), this.toggleClassName("lenis", true), this.velocity = 0, this.isLocked = false, this.isStopped = false, this.isSmooth = n || o, this.isScrolling = false, this.targetScroll = this.animatedScroll = this.actualScroll, this.options.wrapper.addEventListener("scroll", this.onNativeScroll, false), this.virtualScroll = new VirtualScroll(s, { touchMultiplier: m, wheelMultiplier: v }), this.virtualScroll.on("scroll", this.onVirtualScroll);
  }
  destroy() {
    this.emitter.destroy(), this.options.wrapper.removeEventListener("scroll", this.onNativeScroll, false), this.virtualScroll.destroy(), this.dimensions.destroy(), this.toggleClassName("lenis", false), this.toggleClassName("lenis-smooth", false), this.toggleClassName("lenis-scrolling", false), this.toggleClassName("lenis-stopped", false), this.toggleClassName("lenis-locked", false);
  }
  on(t2, e2) {
    return this.emitter.on(t2, e2);
  }
  off(t2, e2) {
    return this.emitter.off(t2, e2);
  }
  setScroll(t2) {
    this.isHorizontal ? this.rootElement.scrollLeft = t2 : this.rootElement.scrollTop = t2;
  }
  resize() {
    this.dimensions.resize();
  }
  emit() {
    this.emitter.emit("scroll", this);
  }
  reset() {
    this.isLocked = false, this.isScrolling = false, this.animatedScroll = this.targetScroll = this.actualScroll, this.velocity = 0, this.animate.stop();
  }
  start() {
    this.isStopped && (this.isStopped = false, this.reset());
  }
  stop() {
    this.isStopped || (this.isStopped = true, this.animate.stop(), this.reset());
  }
  raf(t2) {
    const e2 = t2 - (this.time || t2);
    this.time = t2, this.animate.advance(1e-3 * e2);
  }
  scrollTo(e2, { offset: i = 0, immediate: s = false, lock: o = false, duration: n = this.options.duration, easing: r = this.options.easing, lerp: l = !n && this.options.lerp, onComplete: h, force: a = false, programmatic: c = true } = {}) {
    if (!this.isStopped && !this.isLocked || a) {
      if (["top", "left", "start"].includes(e2)) e2 = 0;
      else if (["bottom", "right", "end"].includes(e2)) e2 = this.limit;
      else {
        let t2;
        if ("string" == typeof e2 ? t2 = document.querySelector(e2) : (null == e2 ? void 0 : e2.nodeType) && (t2 = e2), t2) {
          if (this.options.wrapper !== window) {
            const t3 = this.options.wrapper.getBoundingClientRect();
            i -= this.isHorizontal ? t3.left : t3.top;
          }
          const s2 = t2.getBoundingClientRect();
          e2 = (this.isHorizontal ? s2.left : s2.top) + this.animatedScroll;
        }
      }
      if ("number" == typeof e2) {
        if (e2 += i, e2 = Math.round(e2), this.options.infinite ? c && (this.targetScroll = this.animatedScroll = this.scroll) : e2 = t(0, e2, this.limit), s) return this.animatedScroll = this.targetScroll = e2, this.setScroll(this.scroll), this.reset(), void (null == h || h(this));
        if (!c) {
          if (e2 === this.targetScroll) return;
          this.targetScroll = e2;
        }
        this.animate.fromTo(this.animatedScroll, e2, { duration: n, easing: r, lerp: l, onStart: () => {
          o && (this.isLocked = true), this.isScrolling = true;
        }, onUpdate: (t2, e3) => {
          this.isScrolling = true, this.velocity = t2 - this.animatedScroll, this.direction = Math.sign(this.velocity), this.animatedScroll = t2, this.setScroll(this.scroll), c && (this.targetScroll = t2), e3 || this.emit(), e3 && (this.reset(), this.emit(), null == h || h(this), this.__preventNextScrollEvent = true, requestAnimationFrame((() => {
            delete this.__preventNextScrollEvent;
          })));
        } });
      }
    }
  }
  get rootElement() {
    return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
  }
  get limit() {
    return this.options.__experimental__naiveDimensions ? this.isHorizontal ? this.rootElement.scrollWidth - this.rootElement.clientWidth : this.rootElement.scrollHeight - this.rootElement.clientHeight : this.dimensions.limit[this.isHorizontal ? "x" : "y"];
  }
  get isHorizontal() {
    return "horizontal" === this.options.orientation;
  }
  get actualScroll() {
    return this.isHorizontal ? this.rootElement.scrollLeft : this.rootElement.scrollTop;
  }
  get scroll() {
    return this.options.infinite ? (t2 = this.animatedScroll, e2 = this.limit, (t2 % e2 + e2) % e2) : this.animatedScroll;
    var t2, e2;
  }
  get progress() {
    return 0 === this.limit ? 1 : this.scroll / this.limit;
  }
  get isSmooth() {
    return this.__isSmooth;
  }
  set isSmooth(t2) {
    this.__isSmooth !== t2 && (this.__isSmooth = t2, this.toggleClassName("lenis-smooth", t2));
  }
  get isScrolling() {
    return this.__isScrolling;
  }
  set isScrolling(t2) {
    this.__isScrolling !== t2 && (this.__isScrolling = t2, this.toggleClassName("lenis-scrolling", t2));
  }
  get isStopped() {
    return this.__isStopped;
  }
  set isStopped(t2) {
    this.__isStopped !== t2 && (this.__isStopped = t2, this.toggleClassName("lenis-stopped", t2));
  }
  get isLocked() {
    return this.__isLocked;
  }
  set isLocked(t2) {
    this.__isLocked !== t2 && (this.__isLocked = t2, this.toggleClassName("lenis-locked", t2));
  }
  get className() {
    let t2 = "lenis";
    return this.isStopped && (t2 += " lenis-stopped"), this.isLocked && (t2 += " lenis-locked"), this.isScrolling && (t2 += " lenis-scrolling"), this.isSmooth && (t2 += " lenis-smooth"), t2;
  }
  toggleClassName(t2, e2) {
    this.rootElement.classList.toggle(t2, e2), this.emitter.emit("className change", this);
  }
};
export {
  Lenis as default
};
//# sourceMappingURL=@studio-freight_lenis.js.map
