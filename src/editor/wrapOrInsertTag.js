import * as editorConfig from "../constants/editorConfig";

export function wrapOrInsertTag(editor, tag) {
    // Extract the base tag (before any =, e.g., color=red -> color)
    const baseTag = tag.split('=')[0];

    if (!editorConfig.SUPPORTED_TAGS.includes(baseTag)) return; // ignore unsupported tags

    const model = editor.getModel();
    let selection = editor.getSelection();
    let text = model.getValueInRange(selection);
    editor.pushUndoStop();

    // Special case for literal dashes
    if (tag === '-----') {
        editor.executeEdits('preview', [{
            range: selection,
            text: '-----',
            forceMoveMarkers: true
        }]);
        const pos = selection.getStartPosition();
        editor.setPosition({
            lineNumber: pos.lineNumber,
            column: pos.column + 5 // move cursor after the inserted dashes
        });
    } else if (text || tag.startsWith('color=')) {
        editor.executeEdits('preview', [{
            range: selection,
            text: `[${tag}]${text}[/${tag.split('=')[0]}]`,
            forceMoveMarkers: true
        }]);
    } else if (text) {
        // Wrap selected text
        editor.executeEdits('preview', [{
            range: selection,
            text: `[${tag}]${text}[/${tag}]`,
            forceMoveMarkers: true
        }]);
    } else {
        // Insert tag pair and move cursor in between
        const insertText = `[${tag}][/${tag}]`;
        editor.executeEdits('preview', [{
            range: selection,
            text: insertText,
            forceMoveMarkers: true
        }]);
        const pos = selection.getStartPosition();
        editor.setPosition({
            lineNumber: pos.lineNumber,
            column: pos.column + tag.length + 2
        });

        editor.pushUndoStop();
        editor.focus();
    }
}