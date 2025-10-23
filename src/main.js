import 'github-markdown-css/github-markdown-light.css';
import {setupEditor} from "./editor/setupEditor";
import {presetValue} from "./editor/editor";
import {DEFAULT_INPUT} from "./constants/editorConfig";
import {initScrollBarSync, initToolBarStyleSync} from "./toolbar/toolbar";
import {loadLastContent, loadScrollBarSettings, loadToolBarSettings, saveLastContent} from "./load/load";
import {disableMonacoLanguageWorker} from "./editor/monaco";

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
