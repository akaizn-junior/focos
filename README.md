# Focos

Add focus to elements on the screen referenced by coordinates

## Usage

```html
    ...
    <div data-focos-cell="0,2"></div>
    <div data-focos-cell="0,1"></div>
    <div data-focos-cell="0,2"></div>
    ...
```

```js
// Initialize focos
...
window.Focos({
    keys: { // optional | default arrow keys
      w: 'up',
      a: 'left',
      d: 'rigth',
      z: 'down'
    },
    gridSize: '3x1', // required | if bad value fallbacks to '1x1'
    step: 1, // optional | default '1'
    focusOnClick: true, // optional | default 'false'
    initialFocus: [0, 1] // optional | default 'undefined'
}, (target, cell) => {
    /* optional callback */
});
...
```

## Author

&copy; 2019 Simao Nziaka
