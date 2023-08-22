import { writable } from 'svelte/store';

const states = {};
export function registerState(id, state) {
    states[id] = state;
}

let _currentState = null;
export let currentStateId = writable(null);
export let stateVars = writable({ activeSrc: null });
export function go(id) {
    const state = states[id];
    if (!state) {
        throw new Error(`Unknown state: ${id}`);
    }
    _currentState = state;
    currentStateId.set(id);
    if (_currentState.init) {
        _currentState.init();
    }
    console.log(`current state is`, _currentState);
}

export function setState(state) {
    stateVars.update(s => {
       return { ...s, ...state }; 
    });
}

export function exec(id, ...params) {
    const action = actions[id];
    if (!action) {
        throw new Error(`Unknown action: ${id}`);
    }

    action(...params);
    console.log(`executed action`, id);
}


const actions = {};
export function registerAction(id, action) {
    actions[id] = action;
}

registerState('playing', {
    init: () => {
        exec('play');
    },
    ok: () => {
        go('paused');
    },
    left: () => {
        exec('rewind');
    },
    right: () => {
        exec('forward');
    }
});

registerState('paused', {
    init: () => {
        exec('pause');
    },
    ok: () => {
        go('playing');
    },
    up: () => {
        go('menu');
    },
    down: () => {
        go('menu');
    },
    left: () => {
        exec('rewind');
    },
    right: () => {
        exec('forward');
    }
});

registerState('menu', {
    back: () => {
        go('paused');
    }
});

registerState('options', {
});

registerState('browser', {
});

/** @param {KeyboardEvent} e */
function onKeydown(e) {
    if (!_currentState)
        return;
    e.preventDefault();

    switch (e.keyCode) {
        case 37: // LEFT arrow
            console.log('left');
            _currentState.left && _currentState.left();
            break;
        case 38: // UP arrow
            console.log('up');
            _currentState.up && _currentState.up();
            break;
        case 39: // RIGHT arrow
            console.log('right');
            _currentState.right && _currentState.right();
            break;
        case 40: // DOWN arrow
            console.log('down');
            _currentState.down && _currentState.down();
            break;
        case 13: // OK button / Enter
            console.log('ok');
            _currentState.ok && _currentState.ok();
            break;
        case 8: // backspace button
        case 10009: // RETURN button
        _currentState.back && _currentState.back();
            // tizen.application.getCurrentApplication().exit();
            break;
        default:
            break;
    }
}

document.addEventListener('keydown', onKeydown);