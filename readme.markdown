# amplitude-viewer

render amplitudes like an oscilloscope in the browser given arrays of data

# example

``` js
var ascope = require('amplitude-viewer')(fn);
ascope.appendTo('#scope');

setInterval(function () {
    ascope.setTime(Date.now() / 1000);
    ascope.draw(fn);
}, 50);

function fn (t) {
    return sin(440) * 0.25 + sin(441) * 0.25 + sin(880) * 0.5;
    function sin (x) { return Math.sin(2 * Math.PI * t * x) }
}
```

# methods

``` js
var viewer = require('amplitude-viewer')
```

## var ascope = viewer()

Create a new viewer.

## ascope.appendTo(target)

Append the ascope element to `target`, a query selector string or container
element.

## ascope.setTime(t)

Set the drawing time in seconds.

## ascope.setOffset(t)

Set an offset to the drawing time in seconds.

## ascope.setDuration(d)

Set the width of the time window.

## ascope.draw(fn)

Draw a wave according to `fn(t)`, which should return an amplitude from -1 to 1
give a time `t` in seconds.

# install

With [npm](https://npmjs.org) do:

```
npm install amplitude-viewer
```

# license

MIT
