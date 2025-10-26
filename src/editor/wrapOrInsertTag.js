import * as editorConfig from "../constants/editorConfig";
import {MENTION_PATTERNS, NAVIGATION_PATTERN} from "../constants/editorConfig";

export function wrapOrInsertTag(editor, tag) {
    const model = editor.getModel();
    let selection = editor.getSelection();
    let text = model.getValueInRange(selection);
    editor.pushUndoStop();

    // Check if the tag is a mention
    for (const pattern of MENTION_PATTERNS) {
        const match = tag.match(pattern);
        if (match) {
            // Example: simply insert the tag as-is
            editor.executeEdits('preview', [{
                range: selection,
                text: tag,
                forceMoveMarkers: true
            }]);

            const pos = selection.getStartPosition();
            editor.setPosition({
                lineNumber: pos.lineNumber,
                column: pos.column + tag.length
            });
            editor.focus();
            return; // stop further processing
        }
    }

    // Check if the tag matches the bracketed link pattern
    if (tag.match(NAVIGATION_PATTERN)) {
        // Example: insert the bracketed link as-is
        editor.executeEdits('preview', [{
            range: selection,
            text: tag,
            forceMoveMarkers: true
        }]);

        const pos = selection.getStartPosition();
        editor.setPosition({
            lineNumber: pos.lineNumber,
            column: pos.column + tag.length
        });
        editor.focus();
        return;
    }

    // Extract the base tag (before any =, e.g., color=red -> color)
    const baseTag = tag.split('=')[0];
    if (!editorConfig.SUPPORTED_TAGS.includes(baseTag)) return; // ignore unsupported tags

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
