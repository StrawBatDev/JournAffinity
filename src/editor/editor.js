import {DEFAULT_INPUT} from "../constants/editorConfig";
import * as editorConfig from "../constants/editorConfig";
import {editor} from "monaco-editor";
import {copyToClipboard, notifyCopied} from "./clipboard";


export let presetValue = (editor, value, hasEdited) => {
    editor.setValue(value);
    editor.revealPosition({lineNumber: 1, column: 1});
    editor.focus();
    hasEdited(false);
};

export let registerCopyButton = (editor) => {
    document.querySelector("#copy-button").addEventListener('click', (event) => {
        event.preventDefault();
        let value = editor.getValue();
        copyToClipboard(value, () => {
            notifyCopied();
        }, () => {/* nothing to do */
        });
    });
}

export let registerResetButton = (editor, hasEdited) => {
    document.querySelector("#reset-button").addEventListener('click', (event) => {
        event.preventDefault();
        reset(editor, hasEdited);
    });
};

export let registerEditorDivider = () => {
    let lastLeftRatio = 0.5;
    const divider = document.getElementById('split-divider');
    const leftPane = document.getElementById('edit');
    const rightPane = document.getElementById('preview');
    const container = document.getElementById('container');

    let isDragging = false;

    divider.addEventListener('mouseenter', () => {
        divider.classList.add('hover');
    });

    divider.addEventListener('mouseleave', () => {
        if (!isDragging) {
            divider.classList.remove('hover');
        }
    });

    divider.addEventListener('mousedown', () => {
        isDragging = true;
        divider.classList.add('active');
        document.body.style.cursor = 'col-resize';
    });

    divider.addEventListener('dblclick', () => {
        const containerRect = container.getBoundingClientRect();
        const totalWidth = containerRect.width;
        const dividerWidth = divider.offsetWidth;
        const halfWidth = (totalWidth - dividerWidth) / 2;

        leftPane.style.width = halfWidth + 'px';
        rightPane.style.width = halfWidth + 'px';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        document.body.style.userSelect = 'none';
        const containerRect = container.getBoundingClientRect();
        const totalWidth = containerRect.width;
        const offsetX = e.clientX - containerRect.left;
        const dividerWidth = divider.offsetWidth;

        // Prevent overlap or out-of-bounds
        const minWidth = 100;
        const maxWidth = totalWidth - minWidth - dividerWidth;
        const leftWidth = Math.max(minWidth, Math.min(offsetX, maxWidth));
        leftPane.style.width = leftWidth + 'px';
        rightPane.style.width = (totalWidth - leftWidth - dividerWidth) + 'px';
        lastLeftRatio = leftWidth / (totalWidth - dividerWidth);
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            divider.classList.remove('active');
            divider.classList.remove('hover');
            document.body.style.cursor = 'default';
            document.body.style.userSelect = '';
        }
    });

    window.addEventListener('resize', () => {
        const containerRect = container.getBoundingClientRect();
        const totalWidth = containerRect.width;
        const dividerWidth = divider.offsetWidth;
        const availableWidth = totalWidth - dividerWidth;

        const newLeft = availableWidth * lastLeftRatio;
        const newRight = availableWidth * (1 - lastLeftRatio);

        leftPane.style.width = newLeft + 'px';
        rightPane.style.width = newRight + 'px';
    });
};

let reset = (editor, hasEdited) => {
    let changed = editor.getValue() !== DEFAULT_INPUT;
    if (hasEdited || changed) {
        var confirmed = window.confirm(editorConfig.confirmationMessage);
        if (!confirmed) {
            return;
        }
    }
    presetValue(DEFAULT_INPUT);
    document.querySelectorAll('.column').forEach((element) => {
        element.scrollTo({top: 0});
    });
};
