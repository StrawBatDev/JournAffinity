import * as editorConfig from "../constants/editorConfig";
import * as monaco from 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/+esm';
import {registerToolbarButtons} from "../toolbar/toolbar";
import {convertBbcodeToHtml} from "../preview/preview";
import {registerCopyButton, registerEditorDivider, registerResetButton} from "./editor";
import {registerYoutubeWrapperClick} from "../preview/youtubeWrapper";
import {wrapOrInsertTag} from "./wrapOrInsertTag";


function registerEditor() {
    monaco.languages.register({id: editorConfig.BBCODE_MONACO_LANGUAGE_ID});
    monaco.languages.setMonarchTokensProvider(editorConfig.BBCODE_MONACO_LANGUAGE_ID, {
        defaultToken: '',
        tokenizer: {
            root: [
                [new RegExp(editorConfig.TAG_PATTERN), 'keyword'],
                [/\[[^\]]+]/, 'identifier'],
                [/./, '']
            ]
        }
    });
}

function registerCompletionItemProvider() {
    monaco.languages.registerCompletionItemProvider(editorConfig.BBCODE_MONACO_LANGUAGE_ID, {
        triggerCharacters: ['['],
        provideCompletionItems: (model, position) => {
            return {
                suggestions: editorConfig.SUPPORTED_TAGS.map(tag => ({
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
    return monaco.editor.create(document.querySelector('#editor'), {
        fontSize:/*--------------*/ 14,
        language:/*--------------*/ editorConfig.BBCODE_MONACO_LANGUAGE_ID,
        minimap:/*---------------*/ {enabled: false},
        scrollBeyondLastLine:/*--*/ false,
        automaticLayout:/*-------*/ true,
        scrollbar:/*-------------*/ {vertical: 'visible', horizontal: 'visible'},
        wordWrap:/*-------------*/ 'on',
        hover:/*-----------------*/ {enabled: false},
        quickSuggestions:/*------*/ true, // enable quick suggestions
        suggestOnTriggerCharacters: true, // trigger on typing [
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
        let changed = editor.getValue() !== editorConfig.DEFAULT_INPUT;
        if (changed) hasEdited(true);
        const value = editor.getValue();
        convertBbcodeToHtml(value).catch(err => {
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
