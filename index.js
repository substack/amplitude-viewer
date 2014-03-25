var fs = require('fs');
var html = fs.readFileSync(__dirname + '/scope.html', 'utf8');

var domify = require('domify');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;
var slideways = require('slideways');

module.exports = Scope;
inherits(Scope, EventEmitter);

function Scope (opts) {
    var self = this;
    if (!(this instanceof Scope)) return new Scope(opts);
    if (!opts) opts = {};
    
    this.element = domify(html)[0];
    this.element.style.width = '100%';
    this.element.style.height = '100%';
    
    this.svg = createElement('svg');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', '100%');
    this.element.appendChild(this.svg);
    
    var p = this.polyline = createElement('polyline');
    p.setAttribute('stroke', opts.stroke || 'cyan');
    p.setAttribute('stroke-width', opts.strokeWidth || '4px');
    p.setAttribute('fill', 'transparent');
    this.svg.appendChild(this.polyline);
    
    var shield = this.element.querySelector('.shield');
    shield.style.position = 'absolute';
    shield.style.top = '0px';
    shield.style.bottom = '0px';
    shield.style.left = '0px';
    shield.style.right = '0px';
    shield.style.zIndex = 5;
    shield.style.backgroundColor = 'transparent';
    
    shield.addEventListener('click', function (ev) {
        self.emit('click', ev);
    });
    
    this.duration = opts.duration || 1 / 50;
    this.time = 0;
    this.offset = 0;
    
    var sopts = opts.slider || {
        min: -1, max: 3,
        init: Math.log(50) / Math.log(10)
    };
    this.createSlider(sopts, function (x) {
        self.setDuration(Math.pow(10, -x))
    });
    
    var oopts = opts.offset || {
        min: -10,
        max: 10,
        init: 0
    };
    this.createSlider(oopts, function (x) {
        self.setOffset(x / Math.log(self.duration) / Math.log(10));
    });
}

Scope.prototype.appendTo = function (target) {
    if (typeof target === 'string') target = document.querySelector(target);
    target.appendChild(this.element);
    this._target = target;
    this.resize();
};

Scope.prototype.setDuration = function (d) {
    this.duration = d;
    if (this._lastFn) this.draw(this._lastFn);
};

Scope.prototype.setTime = function (t) {
    this.time = t;
};

Scope.prototype.setOffset = function (x) {
    this.offset = x * this.duration;
    if (this._lastFn) this.draw(this._lastFn);
};

Scope.prototype.resize = function () {
    if (!this._target) return;
    var style = window.getComputedStyle(this.svg);
    this.width = parseInt(style.width);
    this.height = parseInt(style.height);
};

Scope.prototype.draw = function (fn) {
    var samples = 500;
    this._lastFn = fn;
    
    var points = [];
    for (var i = 0; i < samples; i++) {
        var t = this.offset + this.time + i / samples * this.duration;
        var res = Math.max(-1, Math.min(1, fn(t)));
        if (isNaN(res)) res = 0;
        var x = this.width * (i / samples);
        var y = (res + 1) / 2 * (this.height - 25 * 2) + 10;
        points.push(x + ',' + y);
    }
    this.polyline.setAttribute('points', points.join(' '));
};

Scope.prototype.createSlider = function (opts, f) {
    if (!opts) opts = {};
    var a = slideways(opts);
    if (f) a.on('value', f);
    a.appendTo(this.element.querySelector('.sliders'));
    a.element.style.zIndex = 10;
    return a;
};

function createElement (name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}
