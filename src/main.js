import {setupEditor} from "./setupEditor.js";
import {presetValue} from "./editor.js";
import {initScrollBarSync, initToolBarStyleSync} from "./toolbar.js";
import {loadLastContent, loadScrollBarSettings, loadToolBarSettings, saveLastContent} from "./load.js";
import {disableMonacoLanguageWorker} from "./monaco.js";
import '../css/theme.css';
import '../css/style.css';
import '../css/preview.css';
import '../css/modal.css';

const init = () => {
    disableMonacoLanguageWorker()

    let hasEdited = false;
    let scrollBarSync = false;
    let toolBarStyle = false;

    let editor = setupEditor((_hasEdited) => {
        hasEdited = _hasEdited;
    }, saveLastContent, () => scrollBarSync)

    let scrollBarSettings = loadScrollBarSettings() || false;
    initScrollBarSync(scrollBarSettings, (update) => {
        scrollBarSync = update
    });

    let toolBarSettings = loadToolBarSettings() || false;
    initToolBarStyleSync(toolBarSettings, (update) => {
        toolBarStyle = update
    });

    let lastContent = loadLastContent();
    if (lastContent) {
        presetValue(editor, lastContent, (_hasEdited) => {
            hasEdited = _hasEdited
        });
    } else {
        presetValue(editor, DEFAULT_INPUT, (_hasEdited) => {
            hasEdited = _hasEdited;
        });
    }
};

window.addEventListener("load", () => {
    init();
});
