/*!
 * Focos
 * Add focus to elements on the screen referenced by coordinates
 * (c) 2019 Verdexdesign
 */

const $$g = {
    globalPoint: [0, 0],
    ops: ['up', 'down', 'left', 'right'], // focos operations
    callback: () => {},
    focusWithTabIndex: false
};

function nextPoint(point, origin, width, height, step = 1) {
    // x: horizontal position, y: vertical position
    let x = point[0];
    let y = point[1];
    // origin coords
    const x0 = origin[0];
    const y0 = origin[1];
    // the distance to move from a point to the next
    let s = step || 1;

    return {
        up: includeFirst => {
            let top = height - 1;

            if (y >= y0 && y + s <= top) {
                return includeFirst ? point : [x, y + s];
            }

            if (y >= top || y + s >= top) {
                return point;
            }

            if (y < y0) {
                return origin;
            }
        },
        down: includeFirst => {
            if (y - s >= y0) {
                return includeFirst ? [x0, height - 1] : [x, y - s];
            }

            if (y <= y0 || y - s <= y0) {
                return includeFirst ? [x0, height - 1] : point;
            }
        },
        left: includeFirst => {
            if (x - s >= x0) {
                return includeFirst ? [width - 1, y0] : [x - s, y];
            }

            if (x <= x0 || x - s <= x0) {
                return includeFirst ? [width - 1, y0] : point;
            }
        },
        right: includeFirst => {
            if (x >= x0 && x + s <= width - 1) {
                return includeFirst ? origin : [x + s, y];
            }

            if (x >= width - 1 || x + s >= width - 1) {
                return point;
            }

            if (x < x0) {
                return origin;
            }
        }
    };
}

function focosSubject(elem) {
    if (elem && elem.dataset.focosSubject) {
        const subject = elem.dataset.focosSubject;
        const child = subject.includes('child') && subject;
        const childIndex = child && subject.split('-')[1];
        return childIndex && elem.children[childIndex]
            ? elem.children[childIndex]
            : elem;
    }

    return elem;
}

function clearFocus() {
    const subject = focosSubject(document.getElementsByClassName('focused')[0]);

    if (subject) {
        subject.classList.remove('focused');
        $$g.focusWithTabIndex && subject.removeAttribute('tabindex');
    }
}

function getCellValue(grid, point) {
    const x = Math.abs(point[0]);
    const y = Math.abs(point[1]);
    return grid[y] && grid[y][x] ? grid[y][x] : grid[0][0];
}

function validFocosDataset(cellData) {
    if (cellData) {
        let x = parseInt(cellData.split(',')[0], 10);
        let y = parseInt(cellData.split(',')[1], 10);
        return { cell: [x, y], class: 'focos-cell'.concat(x, y) };
    }

    return { cell: [], class: '' };
}

function focusTarget(element) {
    const subject = focosSubject(element);
    if (subject) {
        $$g.focusWithTabIndex && subject.setAttribute('tabindex', '0');
        subject.focus && subject.focus();
        subject.classList.add('focused');
    }
}

function focusCell(grid, point) {
    const cell = getCellValue(grid, point);
    focusTarget(cell);
    return $$g.callback(cell, point);
}

function buildGrid(height, elems) {
    // initialize the grid with empty arrays
    const grid = Array.from({ length: height }, () => []);

    for (let i = 0; i < elems.length; i++) {
        const elem = elems[i];
        const subject = focosSubject(elem);

        if (elem.dataset.focosCell) {
            const data = validFocosDataset(elem.dataset.focosCell);
            subject.classList.add('focusable');
            subject.classList.add(data.class);
            grid[data.cell[1]] && grid[data.cell[1]].push(subject);
        }
    }

    return grid;
}

function focusFirst(initial, grid, point) {
    if (initial && initial.length && point[0] === initial[0] && point[1] === initial[1]) {
        focusCell(grid, point);
    }
}

function validOpts(opts) {
    const defaultKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    // user inputs
    let { keys, initialFocus, step, gridSize, focusOnClick, focusWithTabIndex } = opts;

    // validate size
    let Size = RegExp(/^[0-9]+x[0-9]+$/gm);
    !Size.test(gridSize) && (gridSize = '1x1');
    const rows = parseInt(gridSize.split('x')[0], 10);
    const cols = parseInt(gridSize.split('x')[1], 10);

    // replace inputs with defaults for not required fields
    keys = keys || defaultKeys;

    // validate the step to move from point to point
    step = Math.floor(Math.abs(step)) || 1;

    // use tabindex on focus or not
    $$g.focusWithTabIndex = focusWithTabIndex;

    return {
        keys,
        initialFocus,
        step,
        size: { rows, cols },
        focusOnClick
    };
}

function run(opts, elems) {
    let { keys, initialFocus, step, size, focusOnClick } = opts;

    // grid with and height
    const width = size.cols;
    const height = size.rows;

    // build a grid out of the relevant elements
    const grid = buildGrid(height, elems);

    // editable global entry point, will be focused first if enabled
    initialFocus && ($$g.globalPoint = initialFocus);

    // origin point
    let origin = [0, 0];

    // add initial focus to a cell if enabled
    focusFirst(initialFocus, grid, $$g.globalPoint);

    // track key presses
    let keyPressCount = 0;

    // lose focus on document mouse click
    document.onmousedown = e => {
        const t = e.target;
        const isCell = t.dataset.focosCell;

        !isCell && clearFocus();
        if (isCell && focusOnClick) {
            $$g.globalPoint = validFocosDataset(t.dataset.focosCell).cell;
            clearFocus();
            focusCell(grid, $$g.globalPoint);
        }
    };

    document.addEventListener('keyup', e => {
        e.preventDefault();
        const key = e.key;
        const keyCode = e.keyCode;

        if (keys && (keys[key] || keys[keyCode])) {
            const op = keys[key] || keys[keyCode];
            const includeFirst = keyPressCount === 0 && !initialFocus;

            if ($$g.ops.indexOf(op) !== -1) {
                $$g.globalPoint = nextPoint($$g.globalPoint, origin, width, height, step)[op](includeFirst);
                clearFocus();
                focusCell(grid, $$g.globalPoint);
                keyPressCount = 1;
            }
        }
    });
}

function focos(opts, callback) {
    callback && ($$g.callback = callback);
    // read all relevant elements
    const elems = document.querySelectorAll('[data-focos-cell]');
    elems.length && run(validOpts(opts), elems);
}

// Expose the API
window['focos'] = focos;
