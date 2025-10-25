import {wrapOrInsertTag} from "../editor/wrapOrInsertTag";
import * as toolbar from "../constants/toolbar";
import Storehouse from "storehouse-js";
import * as localStorage from "../constants/localStorage";
import {openColorPicker} from "../modal/colorPicker";

function registerToolbarButtons(editor) {

    // document.getElementById('cut').addEventListener('click', () => {
    // });
    // document.getElementById('cut2').addEventListener('click', () => {
    // });
    // document.getElementById('copy').addEventListener('click', () => {
    // });
    // document.getElementById('copy2').addEventListener('click', () => {
    // });
    // document.getElementById('paste').addEventListener('click', () => {
    // });
    // document.getElementById('paste2').addEventListener('click', () => {
    // });

    // document.getElementById('icon').addEventListener('click', () => {
    // });
    // document.getElementById('icon2').addEventListener('click', () => {
    // });
    // document.getElementById('icon-username').addEventListener('click', () => {
    // });
    // document.getElementById('icon-username2').addEventListener('click', () => {
    // });
    // document.getElementById('icon-username-legacy').addEventListener('click', () => {
    // });
    // document.getElementById('icon-username-legacy2').addEventListener('click', () => {
    // });
    // document.getElementById('username-only').addEventListener('click', () => {
    // });
    // document.getElementById('username-only2').addEventListener('click', () => {
    // });
    // document.getElementById('navigation').addEventListener('click', () => {
    // });
    // document.getElementById('navigation2').addEventListener('click', () => {
    // });
    document.getElementById('bold').addEventListener('click', () => wrapOrInsertTag(editor, 'b'));
    document.getElementById('bold2').addEventListener('click', () => wrapOrInsertTag(editor, 'b'));
    document.getElementById('italic').addEventListener('click', () => wrapOrInsertTag(editor, 'i'));
    document.getElementById('italic2').addEventListener('click', () => wrapOrInsertTag(editor, 'i'));
    document.getElementById('underline').addEventListener('click', () => wrapOrInsertTag(editor, 'u'));
    document.getElementById('underline2').addEventListener('click', () => wrapOrInsertTag(editor, 'u'));
    document.getElementById('strikethrough').addEventListener('click', () => wrapOrInsertTag(editor, 's'));
    document.getElementById('strikethrough2').addEventListener('click', () => wrapOrInsertTag(editor, 's'))
    document.getElementById('align-left').addEventListener('click', () => wrapOrInsertTag(editor, 'left'));
    document.getElementById('align-left2').addEventListener('click', () => wrapOrInsertTag(editor, 'left'))
    document.getElementById('align-center').addEventListener('click', () => wrapOrInsertTag(editor, 'center'));
    document.getElementById('align-center2').addEventListener('click', () => wrapOrInsertTag(editor, 'center'))
    document.getElementById('align-right').addEventListener('click', () => wrapOrInsertTag(editor, 'right'));
    document.getElementById('align-right2').addEventListener('click', () => wrapOrInsertTag(editor, 'right'))
    document.getElementById('sub').addEventListener('click', () => wrapOrInsertTag(editor, 'sub'));
    document.getElementById('sub2').addEventListener('click', () => wrapOrInsertTag(editor, 'sub'))
    document.getElementById('sup').addEventListener('click', () => wrapOrInsertTag(editor, 'sup'));
    document.getElementById('sup2').addEventListener('click', () => wrapOrInsertTag(editor, 'sup'))
    document.getElementById('line').addEventListener('click', () => wrapOrInsertTag(editor, '-----'))
    document.getElementById('line2').addEventListener('click', () => wrapOrInsertTag(editor, '-----'))
    document.getElementById('color').addEventListener('click', () => openColorPicker(editor, "color"));
    document.getElementById('color2').addEventListener('click', () => openColorPicker(editor, "color"));
    document.getElementById('h1').addEventListener('click', () => wrapOrInsertTag(editor, 'h1'));
    document.getElementById('h2').addEventListener('click', () => wrapOrInsertTag(editor, 'h2'))
    document.getElementById('h3').addEventListener('click', () => wrapOrInsertTag(editor, 'h3'));
    document.getElementById('h4').addEventListener('click', () => wrapOrInsertTag(editor, 'h4'))
    document.getElementById('h5').addEventListener('click', () => wrapOrInsertTag(editor, 'h5'));
    document.getElementById('h1_2').addEventListener('click', () => wrapOrInsertTag(editor, 'h1'));
    document.getElementById('h2_2').addEventListener('click', () => wrapOrInsertTag(editor, 'h2'))
    document.getElementById('h3_2').addEventListener('click', () => wrapOrInsertTag(editor, 'h3'));
    document.getElementById('h4_2').addEventListener('click', () => wrapOrInsertTag(editor, 'h4'))
    document.getElementById('h5_2').addEventListener('click', () => wrapOrInsertTag(editor, 'h5'));
    document.getElementById('quote').addEventListener('click', () => wrapOrInsertTag(editor, 'quote'));
    document.getElementById('quote2').addEventListener('click', () => wrapOrInsertTag(editor, 'quote'));
    document.getElementById('undoBtn').addEventListener('click', () => editor.trigger('keyboard', 'undo', null));
    document.getElementById('undoBtn2').addEventListener('click', () => editor.trigger('keyboard', 'undo', null));
    document.getElementById('redoBtn').addEventListener('click', () => editor.trigger('keyboard', 'redo', null));
    document.getElementById('redoBtn2').addEventListener('click', () => editor.trigger('keyboard', 'redo', null));

    window.addEventListener('colorSelected', (e) => {

        console.log(e)
        const color = e.detail;
        if (!color) return;

        // Use wrapOrInsertTag to insert BBCode
        wrapOrInsertTag(editor, `color=${color}`);
    });
}

export default registerToolbarButtons

export let initScrollBarSync = (current, update) => {
    let checkbox = document.querySelector('#sync-scroll-checkbox');
    checkbox.checked = current;
    update(current);

    checkbox.addEventListener('change', (event) => {
        let checked = event.currentTarget.checked;
        update(checked);
        saveScrollBarSettings(checked);
    });
};

export let initToolBarStyleSync = (current, update) => {
    let checkbox = document.querySelector('#toolbar-style-checkbox');
    checkbox.checked = current;
    update(current)

    checkbox.addEventListener('change', (event) => {
        let checked = event.currentTarget.checked;
        update(checked);
        saveToolbarStyleSettings(checked);
        toolbar.simpleToolbar.style.display = checked ? 'none' : 'flex';
        toolbar.dropdownToolbar.style.display = checked ? 'flex' : 'none';
    });
};

let saveScrollBarSettings = (settings) => {
    let expiredAt = new Date(2099, 1, 1);
    Storehouse.setItem(localStorage.localStorageNamespace, localStorage.localStorageScrollBarKey, settings, expiredAt);
};

let saveToolbarStyleSettings = (settings) => {
    let expiredAt = new Date(2099, 1, 1);
    Storehouse.setItem(localStorage.localStorageNamespace, localStorage.localStorageScrollBarKey, settings, expiredAt);
};