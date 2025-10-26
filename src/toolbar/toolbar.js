import {wrapOrInsertTag} from "../editor/wrapOrInsertTag";
import * as toolbar from "../constants/toolbar";
import Storehouse from "storehouse-js";
import * as localStorage from "../constants/localStorage";
import {openColorPicker} from "../modal/colorPicker";
import {openMentionPicker} from "../modal/mentionPicker";
import {saveScrollBarSettings, saveToolbarStyleSettings} from "../load/load";
import {openNavigationPicker} from "../modal/navigationPicker";

function registerToolbarButtons(editor) {
    const toolbarActions = {
        'undoBtn': () => editor.trigger('keyboard', 'undo', null),
        'undoBtn2': () => editor.trigger('keyboard', 'undo', null),
        'redoBtn': () => editor.trigger('keyboard', 'redo', null),
        'redoBtn2': () => editor.trigger('keyboard', 'redo', null),

        'cutBtn': () => toolbarAction('editor.action.clipboardCutAction'),
        'cutBtn2': () => toolbarAction('editor.action.clipboardCutAction'),
        'copyBtn': () => toolbarAction('editor.action.clipboardCopyAction'),
        'copyBtn2': () => toolbarAction('editor.action.clipboardCopyAction'),
        'pasteBtn': () => toolbarAction('editor.action.clipboardPasteAction'),
        'pasteBtn2': () => toolbarAction('editor.action.clipboardPasteAction'),
        'deleteBtn': () => toolbarAction('editor.action.clipboardDeleteAction'),
        'deleteBtn2': () => toolbarAction('editor.action.clipboardDeleteAction'),

        'bold': () => wrapOrInsertTag(editor, 'b'),
        'bold2': () => wrapOrInsertTag(editor, 'b'),
        'italic': () => wrapOrInsertTag(editor, 'i'),
        'italic2': () => wrapOrInsertTag(editor, 'i'),
        'underline': () => wrapOrInsertTag(editor, 'u'),
        'underline2': () => wrapOrInsertTag(editor, 'u'),
        'strikethrough': () => wrapOrInsertTag(editor, 's'),
        'strikethrough2': () => wrapOrInsertTag(editor, 's'),

        'align-left': () => wrapOrInsertTag(editor, 'left'),
        'align-left2': () => wrapOrInsertTag(editor, 'left'),
        'align-center': () => wrapOrInsertTag(editor, 'center'),
        'align-center2': () => wrapOrInsertTag(editor, 'center'),
        'align-right': () => wrapOrInsertTag(editor, 'right'),
        'align-right2': () => wrapOrInsertTag(editor, 'right'),

        'sub': () => wrapOrInsertTag(editor, 'sub'),
        'sub2': () => wrapOrInsertTag(editor, 'sub'),
        'sup': () => wrapOrInsertTag(editor, 'sup'),
        'sup2': () => wrapOrInsertTag(editor, 'sup'),

        'line': () => wrapOrInsertTag(editor, '-----'),
        'line2': () => wrapOrInsertTag(editor, '-----'),

        'color': openColorPicker,
        'color2': openColorPicker,
        'mention': openMentionPicker,
        'mention2': openMentionPicker,
        'navigation': openNavigationPicker,
        'navigation2': openNavigationPicker,

        'h1': () => wrapOrInsertTag(editor, 'h1'),
        'h2': () => wrapOrInsertTag(editor, 'h2'),
        'h3': () => wrapOrInsertTag(editor, 'h3'),
        'h4': () => wrapOrInsertTag(editor, 'h4'),
        'h5': () => wrapOrInsertTag(editor, 'h5'),
        'h1_2': () => wrapOrInsertTag(editor, 'h1'),
        'h2_2': () => wrapOrInsertTag(editor, 'h2'),
        'h3_2': () => wrapOrInsertTag(editor, 'h3'),
        'h4_2': () => wrapOrInsertTag(editor, 'h4'),
        'h5_2': () => wrapOrInsertTag(editor, 'h5'),

        'quote': () => wrapOrInsertTag(editor, 'quote'),
        'quote2': () => wrapOrInsertTag(editor, 'quote')
    };

    function toolbarAction(editorAction) {
        editor.focus();
        editor.trigger('toolbar', editorAction);
    }

    Object.entries(toolbarActions).forEach(([id, action]) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', action);
    });

    // TODO - Consider using message instead of custom event
    window.addEventListener('colorSelected', (e) => {
        onColorSelected(editor, e)
    });
    // TODO - Consider using message instead of custom event
    window.addEventListener('mentionSelected', (e) => {
        onMentionSelected(editor, e)
    });

    window.addEventListener('message', (e) => {
        if (!e.data) return;
        if (e.data.type === 'navigationLinksSelected') {
            onNavigationSelected(editor, e);
        }
    });
}

function onColorSelected(editor, e) {
    const color = e.detail;
    if (!color) return;
    wrapOrInsertTag(editor, `color=${color}`);
}

function onMentionSelected(editor, e) {
    const mention = e.detail;
    if (!mention) return;
    wrapOrInsertTag(editor, mention);
}

function onNavigationSelected(editor, e) {
    console.log('Received message:', e.data);
    const { prevId, firstId, nextId } = e.data.data;
    console.log('Inserting:', prevId, firstId, nextId);
    wrapOrInsertTag(editor, `[${prevId},${firstId},${nextId}]`);
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
