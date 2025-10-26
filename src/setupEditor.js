import * as monaco from 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/+esm';
import registerToolbarButtons from "./toolbar.js";
import {updateEditorPreview} from "./preview.js";
import {
    BBCODE_MONACO_LANGUAGE_ID, DEFAULT_INPUT,
    registerCopyButton,
    registerEditorDivider,
    registerResetButton, SUPPORTED_TAGS,
    TAG_PATTERN
} from "./editor.js";
import {registerYoutubeWrapperClick} from "./youtubeWrapper.js";
import {wrapOrInsertTag} from "./wrapOrInsertTag.js";


function registerEditor() {
    monaco.languages.register({id: BBCODE_MONACO_LANGUAGE_ID});
    monaco.languages.setMonarchTokensProvider(BBCODE_MONACO_LANGUAGE_ID, {
        defaultToken: '',
        tokenizer: {
            root: [
                [new RegExp(TAG_PATTERN), 'keyword'],
                [/\[[^\]]+]/, 'identifier'],
                [/./, '']
            ]
        }
    });
}

function registerCompletionItemProvider() {
    monaco.languages.registerCompletionItemProvider(BBCODE_MONACO_LANGUAGE_ID, {
        triggerCharacters: ['['],
        provideCompletionItems: (model, position) => {
            return {
                suggestions: SUPPORTED_TAGS.map(tag => ({
                    label: tag,
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    // Only insert the tag name; user already typed '['
                    insertText: `${tag}]$0[/${tag}]`,
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: `Insert [${tag}]...[/ ${tag}]`
                }))
            };
        }
    });
}

function createEditor() {

    monaco.editor.defineTheme('furAffinityTheme', {
        base: 'vs-dark',    // inherit all vs-dark styles
        inherit: true,      // keep default token colors
        rules: [],          // empty rules, keep syntax colors
        colors: {
            'editor.background': '#1b1b1d',          // your custom background
            'editor.foreground': '#D4D4D4',          // default text
            'editorLineNumber.foreground': '#858585',
            'editorCursor.foreground': '#AEAFAD',
            'editor.selectionBackground': '#264F78',
            'editor.lineHighlightBackground': '#2A2A2A',

            /* Scrollbar styling */
            'scrollbar.shadow': '#00000000',
            'scrollbarSlider.background': '#44475a88',
            'scrollbarSlider.hoverBackground': '#555a7088',
            'scrollbarSlider.activeBackground': '#666b8088',
        }
    });

    return monaco.editor.create(document.querySelector('#editor'), {
        fontSize:/*--------------*/ 14,
        language:/*--------------*/ BBCODE_MONACO_LANGUAGE_ID,
        minimap:/*---------------*/ {enabled: false},
        scrollBeyondLastLine:/*--*/ false,
        automaticLayout:/*-------*/ true,
        scrollbar:/*-------------*/ {vertical: 'visible', horizontal: 'visible'},
        wordWrap:/*-------------*/ 'on',
        hover:/*-----------------*/ {enabled: false},
        quickSuggestions:/*------*/ true, // enable quick suggestions
        suggestOnTriggerCharacters: true, // trigger on typing [
        theme: 'furAffinityTheme',
        folding:/*---------------*/ false
    });
}

function registerKeyboardShortcuts(editor) {
    // Keyboard shortcuts for Cmd/Ctrl + B/I/U/S
    const tagMap = {b: 'b', i: 'i', u: 'u', s: 's'};
    editor.onKeyDown(e => {
        const key = e.browserEvent.key.toLowerCase();
        if ((e.metaKey || e.ctrlKey) && tagMap[key]) {
            e.preventDefault();
            wrapOrInsertTag(editor, tagMap[key]);
        }
    });
}

function registerOnDidChangeModelContent(editor, hasEdited, saveLastContent) {
    editor.onDidChangeModelContent(() => {
        let changed = editor.getValue() !== DEFAULT_INPUT;
        if (changed) hasEdited(true);
        const value = editor.getValue();
        updateEditorPreview(value).catch(err => {
            console.error(err);
        });
        saveLastContent(value);
    });
}

function registerOnDidScrollChange(editor, scrollBarSync) {
    editor.onDidScrollChange((e) => {
        if (!scrollBarSync()) return;

        const scrollTop = e.scrollTop;
        const scrollHeight = e.scrollHeight;
        const height = editor.getLayoutInfo().height;

        const maxScrollTop = scrollHeight - height;
        const scrollRatio = scrollTop / maxScrollTop;

        let previewElement = document.querySelector('#preview');
        let targetY = (previewElement.scrollHeight - previewElement.clientHeight) * scrollRatio;
        previewElement.scrollTo(0, targetY);
    });
}

export function setupEditor(hasEdited, saveLastContent, scrollBarSync) {
    registerEditor()
    const editor = createEditor()
    editor.focus();
    registerCompletionItemProvider()
    registerKeyboardShortcuts(editor)
    registerResetButton(editor, hasEdited);
    registerCopyButton(editor);
    registerToolbarButtons(editor)
    registerYoutubeWrapperClick();
    registerEditorDivider();
    registerOnDidChangeModelContent(editor, hasEdited, saveLastContent)
    registerOnDidScrollChange(editor, scrollBarSync)
    return editor;
}
