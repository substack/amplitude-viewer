var ascope = require('../')(fn);
ascope.appendTo('#scope');

setInterval(function () {
    ascope.setTime(Date.now() / 1000);
    ascope.draw(fn);
}, 50);

function fn (t) {
    return sin(440) * 0.25 + sin(441) * 0.25 + sin(880) * 0.5;
    function sin (x) { return Math.sin(2 * Math.PI * t * x) }
}
