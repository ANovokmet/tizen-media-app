function init() {
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            // Something you want to do when hide or exit.
        } else {
            // Something you want to do when resume.
        }
    });

    // add eventListener for keydown
    document.addEventListener('keydown', function (e) {
        switch (e.keyCode) {
            case 37: // LEFT arrow
                console.log('left');
                break;
            case 38: // UP arrow
                console.log('up');
                break;
            case 39: // RIGHT arrow
                console.log('right');
                break;
            case 40: // DOWN arrow
                console.log('down');
                break;
            case 13: // OK button / Enter
                console.log('ok');
                break;
            case 10009: //RETURN button
                tizen.application.getCurrentApplication().exit();
                break;
            default:
                console.log('Key code : ' + e.keyCode);
                break;
        }
    });
}

window.onload = init;