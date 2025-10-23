import Storehouse from 'storehouse-js';
import * as monaco from 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/+esm';
import DOMPurify from 'dompurify';
import 'github-markdown-css/github-markdown-light.css';

const init = () => {
    let hasEdited = false;
    let scrollBarSync = false;
    let toolBarStyle = false;

    const localStorageNamespace = 'com.markdownlivepreview';
    const localStorageKey = 'last_state';
    const localStorageScrollBarKey = 'scroll_bar_settings';
    const localStorageToolBarStyleKey = 'tool_bar_style_settings';
    const confirmationMessage = 'Are you sure you want to reset? Your changes will be lost.';
    // default template
    const defaultInput = `[h1]JournAffinity v1.0[/h1]
[h2]Whats left?[/h2]
1. Divider lines
2. Comic navigation
3. Text size up and down
4. Text alignment
5. Headers 1-5 to match documentation
6. Quotes
7. :linkfender: -> Creates a link to a user's page.
8. BUTTONS!

Hi, I am :strawbaticon: and this is an [b]WYSIWYG editor[/b] I made to help you write journals and post descriptions on Furaffinity.net!

[h2]Dorky stuff translated for the layman:[/h2]
[b]Furaffinity.net[/b] uses what are called [b]BBCodes[/b] for formatting text; 
BBCode is a lightweight markup language used on many online forums and bulletin boards to format posts.

What I am doing is converting these BBCodes using Regex (Shorthand for 'regular expression') and converting them into HTML (Shorthand for hypertext markup language)
This text is then previewed using CSS (Shorthand for 'Cascading Style Sheets'), heavily inspired by Furaffinity.net's CSS circa 2025.

What you see in the preview should [i]approximate[/i] what you will see on Furaffinity.net when you post.

[h2]Sauces:[/h2]
The BBCodes that this editor can preview have been based on this [url=https://www.furaffinity.net/journal/8342081/]journal[/url] and [url=https://www.furaffinity.net/help/#tags-and-codes]Furaffinity.net's official documentation[/url]

This is forked from another project here: https://markdownlivepreview.com

[h1]Examples[/h1]
[b]Bold[/b]
[i]Italic[/i]
[u]Underline[/u]
[s]Strike-out[/s]
(c)(tm)(r)

Spoiler text: [spoiler]"BOO!"[/spoiler]
Comic navigation: [31017474, 42300460, 42402962]
Colored text: [color=orange]Orange you glad to see me?[/color]

Username only: @strawbat 
🐭 Username: @@strawbat
🐭 Username(Legacy)::iconstrawbat: 
🐭::strawbaticon:

[sup]TEXT[/sup] Makes text Small and Up
[sub]TEXT[/sub] Makes text Small and Bottom

Links: [url=LINK]TEXT HERE[/url] 

Text Alignment:
[left]Slide to the left![/left]
[center]Malcom in the middle![/center]
[right]Slide to the right![/right]

Combinations:
[i][b]Kamina - "We're gonna combine!"[/b][/i]
[b][url=https://www.youtube.com/watch?v=CzVeai1P1H0$0][color=COLORNAME]Simon - "They're going to combine?!"[/color][/url][/b]
    
Video links (Only in journals!)
[yt]https://www.youtube.com/watch?v=CzVeai1P1H0[/yt]
`;

    const SUPPORTED_TAGS = [
        'b', 'i', 'u', 's', 'url', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'spoiler',
        'sup', 'sub', 'color', 'left', 'center', 'right', 'yt'
    ];
    const tagPattern = [
        '\\[',          // opening bracket
        '/?',           // optional slash
        '(', SUPPORTED_TAGS.join('|'), ')', // supported tags
        '(=[^\\]]+)?',  // optional =value
        '\\]'           // closing bracket
    ].join('');

    self.MonacoEnvironment = {
        getWorker(_, label) {
            return new Proxy({}, {
                get: () => () => {
                }
            });
        }
    }

    let setupEditor = () => {
        // Register a simple BBCode language for highlighting
        monaco.languages.register({id: 'bbcode'});
        monaco.languages.setMonarchTokensProvider('bbcode', {
            defaultToken: '',
            tokenizer: {
                root: [
                    [new RegExp(tagPattern), 'keyword'],
                    [/\[[^\]]+\]/, 'identifier'],
                    [/./, '']
                ]
            }
        });

        const editor = monaco.editor.create(document.querySelector('#editor'), {
            fontSize: 14,
            language: 'bbcode',
            minimap: {enabled: false},
            scrollBeyondLastLine: false,
            automaticLayout: true,
            scrollbar: {vertical: 'visible', horizontal: 'visible'},
            wordWrap: 'on',
            hover: {enabled: false},
            quickSuggestions: true, // enable quick suggestions
            suggestOnTriggerCharacters: true, // trigger on typing [
            folding: false
        });

        editor.focus();

        // BBCode tag autocomplete provider
        const SUPPORTED_TAGS = ['b', 'i', 'u', 's', 'url', 'color', 'spoiler'];
        monaco.languages.registerCompletionItemProvider('bbcode', {
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

        // Keyboard shortcuts for Cmd/Ctrl + B/I/U/S
        const tagMap = {b: 'b', i: 'i', u: 'u', s: 's'};
        editor.onKeyDown(e => {
            const key = e.browserEvent.key.toLowerCase();
            if ((e.metaKey || e.ctrlKey) && tagMap[key]) {
                e.preventDefault();
                wrapOrInsertTag(editor, tagMap[key]);
            }
        });

        document.getElementById('bold').addEventListener('click', () => wrapOrInsertTag(editor, 'b'));
        document.getElementById('italic').addEventListener('click', () => wrapOrInsertTag(editor, 'i'));
        document.getElementById('underline').addEventListener('click', () => wrapOrInsertTag(editor, 'u'));
        document.getElementById('strikethrough').addEventListener('click', () => wrapOrInsertTag(editor, 's'));
        // Undo/redo buttons
        document.getElementById('undoBtn').addEventListener('click', () => editor.trigger('keyboard', 'undo', null));
        document.getElementById('redoBtn').addEventListener('click', () => editor.trigger('keyboard', 'redo', null));

        editor.onDidChangeModelContent(() => {
            let changed = editor.getValue() !== defaultInput;
            if (changed) hasEdited = true;
            const value = editor.getValue();
            convert(value);
            saveLastContent(value);
        });

        editor.onDidScrollChange((e) => {
            if (!scrollBarSync) {
                return;
            }

            const scrollTop = e.scrollTop;
            const scrollHeight = e.scrollHeight;
            const height = editor.getLayoutInfo().height;

            const maxScrollTop = scrollHeight - height;
            const scrollRatio = scrollTop / maxScrollTop;

            let previewElement = document.querySelector('#preview');
            let targetY = (previewElement.scrollHeight - previewElement.clientHeight) * scrollRatio;
            previewElement.scrollTo(0, targetY);
        });

        return editor;
    };

    function wrapOrInsertTag(editor, tag) {
        if (!SUPPORTED_TAGS.includes(tag)) return; // ignore unsupported tags
        const model = editor.getModel();
        let selection = editor.getSelection();
        let text = model.getValueInRange(selection);
        editor.pushUndoStop();

        if (text) {
            // Wrap selected text
            editor.executeEdits('bbcode', [{
                range: selection,
                text: `[${tag}]${text}[/${tag}]`,
                forceMoveMarkers: true
            }]);
        } else {
            // Insert tag pair and move cursor in between
            const insertText = `[${tag}][/${tag}]`;
            editor.executeEdits('bbcode', [{
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

    const simpleToolbar = document.getElementById('toolbar-simple');
    const dropdownToolbar = document.getElementById('toolbar-dropdown');

    // TODO - Please extract this to bbcode.js
    function parse(src) {
        if (!src) return "";

        // NOTE: The order that these are handled is deliberate and important, especially line breaks!
        // Furaffinity.net does not add line breaks after headers, but does respect line breaks in the editor.
        // Also, it does not use <p> tags what-so-ever!

        src = parseYouTube(src)

        return src
            // Normalize line endings and convert to <br>
            .replace(/\r\n?/g, "\n")
            .replace(/\n/g, "<br>")

            // Remove <br> immediately before or after headers
            // Also, remove <br> before a header (except the very first)
            .replace(/(<br>\s*)+(?=<h[12])/gi, "")

            // Basics
            .replace(/\[h1\](.*?)\[\/h1\]/gi, '<h1 class="bbcode_h1">$1</h1>')
            .replace(/\[h2\](.*?)\[\/h2\]/gi, '<h2 class="bbcode_h2">$1</h2>')

            .replace(/\[h2\](.*?)\[\/h2\]/gi, '<h2 class="bbcode_h2">$1</h2>')
            // Remove <br> right *after* headers
            .replace(/(<\/h[12]>)<br>/gi, "$1")

            .replace(/\[b\](.*?)\[\/b\]/gi, '<b class="bbcode_b">$1</b>')
            .replace(/\[i\](.*?)\[\/i\]/gi, '<i class="bbcode_i">$1</i>')
            .replace(/\[u\](.*?)\[\/u\]/gi, '<u class="bbcode_u">$1</u>')
            .replace(/\[s\](.*?)\[\/s\]/gi, '<s class="bbcode_s">$1</s>')

            // [url=]
            .replace(/\[url=(https?:\/\/[^\]]+)\](.*?)\[\/url\]/gi,
                '<a href="$1" class="bbcode_link" target="_blank" rel="noopener noreferrer">$2</a>'
            )
            // [url]
            .replace(/\[url\](https?:\/\/[^\]]+)\[\/url\]/gi,
                '<a href="$1" class="bbcode_link" target="_blank" rel="noopener noreferrer">$1</a>'
            )

            // Symbol replacements
            .replace(/\(c\)/gi, '©')
            .replace(/\(tm\)/gi, '™')
            .replace(/\(r\)/gi, '®')

            // Spoilers
            .replace(/\[spoiler\](.*?)\[\/spoiler\]/gi,
                '<span class="bbcode_spoiler">$1</span>'
            )

            // Color tags
            .replace(/\[color=(#[0-9A-F]{3,6}|[a-z]+)\](.*?)\[\/color\]/gi,
                '<span class="bbcode_color" style="color:$1;">$2</span>'
            )

            // 🐭Username
            .replace(/@@([a-z0-9_-]+)/gi, (_, user) =>
                `<span class="fa-mention"> 
                    <a href="https://www.furaffinity.net/user/${user}" class="fa-username"><img src="https://a.facdn.net/${user}.gif"alt="${user}"class="fa-icon" onerror="this.style.display='none'"> ${user}</a>
                </span>`
            )

            // Username
            .replace(/@([a-zA-Z0-9_-]+)/gi, (match, user) =>
                `<span class="fa-mention single">
                    <a href="https://www.furaffinity.net/user/${user}" class="fa-username">${user}</a>
                </span>`
            )

            // 🐭 Username (Legacy)
            .replace(/:icon([a-z0-9_-]+):/gi, (_, user) =>
                `<span class="fa-mention">
                    <a href="https://www.furaffinity.net/user/${user}" class="fa-username"><img src="https://a.facdn.net/${user}.gif" alt="${user}" class="fa-icon" onerror="this.style.display='none'"> ${user}</a>
                </span>`
            )

            // 🐭(Only icon)
            .replace(/:([a-z0-9_-]+)icon:/gi, (_, user) =>
                `<span class="fa-mention">
                    <a href="https://www.furaffinity.net/user/${user}" class="fa-username"><img src="https://a.facdn.net/${user}.gif" alt="${user}" class="fa-icon" onerror="this.style.display='none'"></a>
                </span>`
            );
    }

    // TODO - Please extract this to bbcode.js
    function parseAsync(src) {
        return new Promise((resolve) => {
            resolve(parse(src));
        });
    }

    // Render bbcode text as html
    let convert = async (input) => {
        let html = await parseAsync(input);
        document.querySelector('#output').innerHTML = DOMPurify.sanitize(html);
    };

    // Reset input text
    let reset = () => {
        let changed = editor.getValue() != defaultInput;
        if (hasEdited || changed) {
            var confirmed = window.confirm(confirmationMessage);
            if (!confirmed) {
                return;
            }
        }
        presetValue(defaultInput);
        document.querySelectorAll('.column').forEach((element) => {
            element.scrollTo({top: 0});
        });
    };

    let presetValue = (value) => {
        editor.setValue(value);
        editor.revealPosition({lineNumber: 1, column: 1});
        editor.focus();
        hasEdited = false;
    };

    // ----- sync scroll position -----

    let initScrollBarSync = (settings) => {
        let checkbox = document.querySelector('#sync-scroll-checkbox');
        checkbox.checked = settings;
        scrollBarSync = settings;

        checkbox.addEventListener('change', (event) => {
            let checked = event.currentTarget.checked;
            scrollBarSync = checked;
            saveScrollBarSettings(checked);
        });
    };

    let initToolBarStyleSync = (settings) => {
        let checkbox = document.querySelector('#toolbar-style-checkbox');
        checkbox.checked = settings;
        toolBarStyle = settings

        checkbox.addEventListener('change', (event) => {
            let checked = event.currentTarget.checked;
            toolBarStyle = checked;
            saveToolbarStyleSettings(checked);
            simpleToolbar.style.display = checked ? 'none' : 'flex';
            dropdownToolbar.style.display = checked ? 'flex' : 'none';
        });
    };

    let enableScrollBarSync = () => {
        scrollBarSync = true;
    };

    let disableScrollBarSync = () => {
        scrollBarSync = false;
    };

    // ----- clipboard utils -----

    let copyToClipboard = (text, successHandler, errorHandler) => {
        navigator.clipboard.writeText(text).then(
            () => {
                successHandler();
            },

            () => {
                errorHandler();
            }
        );
    };

    let notifyCopied = () => {
        let labelElement = document.querySelector("#copy-button a");
        labelElement.innerHTML = "Copied!";
        setTimeout(() => {
            labelElement.innerHTML = "Copy";
        }, 1000)
    };

    // ----- setup -----

    // setup navigation actions
    let setupResetButton = () => {
        document.querySelector("#reset-button").addEventListener('click', (event) => {
            event.preventDefault();
            reset();
        });
    };

    let setupCopyButton = (editor) => {
        document.querySelector("#copy-button").addEventListener('click', (event) => {
            event.preventDefault();
            let value = editor.getValue();
            copyToClipboard(value, () => {
                    notifyCopied();
                },
                () => {
                    // nothing to do
                });
        });
    };

    // ----- local state -----

    let loadLastContent = () => {
        let lastContent = Storehouse.getItem(localStorageNamespace, localStorageKey);
        return lastContent;
    };

    let saveLastContent = (content) => {
        let expiredAt = new Date(2099, 1, 1);
        Storehouse.setItem(localStorageNamespace, localStorageKey, content, expiredAt);
    };

    let loadScrollBarSettings = () => {
        let lastContent = Storehouse.getItem(localStorageNamespace, localStorageScrollBarKey);
        return lastContent;
    };

    let loadToolBarSettings = () => {
        let lastContent = Storehouse.getItem(localStorageNamespace, localStorageToolBarStyleKey);
        return lastContent;
    };

    let saveScrollBarSettings = (settings) => {
        let expiredAt = new Date(2099, 1, 1);
        Storehouse.setItem(localStorageNamespace, localStorageScrollBarKey, settings, expiredAt);
    };

    let saveToolbarStyleSettings = (settings) => {
        let expiredAt = new Date(2099, 1, 1);
        Storehouse.setItem(localStorageNamespace, localStorageScrollBarKey, settings, expiredAt);
    };

    let setupDivider = () => {
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

    // ----- entry point -----
    let lastContent = loadLastContent();
    let editor = setupEditor();
    if (lastContent) {
        presetValue(lastContent);
    } else {
        presetValue(defaultInput);
    }
    setupResetButton();
    setupCopyButton(editor);

    let scrollBarSettings = loadScrollBarSettings() || false;
    let toolBarSettings = loadToolBarSettings() || false;
    initScrollBarSync(scrollBarSettings);
    initToolBarStyleSync(toolBarSettings)

    setupDivider();

    function parseYouTube(src) {
        if (!src) return "";

        return src.replace(/\[yt\](https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+))\[\/yt\]/gi,
            (_, fullUrl, videoId) => {
                return `
                <div class="youtubeWrapper" data-video="${videoId}">
                    <div class="youtubeWrapper__thumbnailContainer">
                        <img class="youtubeWrapper__thumbnail" src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" alt="YouTube Video">
                        <div class="youtubeWrapper__playButton"></div>
                    </div>
                </div>
            `;
            }
        );
    }

    document.addEventListener('click', (e) => {
        const wrapper = e.target.closest('.youtubeWrapper');
        if (!wrapper) return;

        const videoId = wrapper.dataset.video;
        wrapper.innerHTML = `
        <iframe
            class="youtubeWrapper__iframe"
            src="https://www.youtube.com/embed/${videoId}?autoplay=1"
            frameborder="0"
            allow="autoplay; encrypted-media; fullscreen"
            allowfullscreen
        ></iframe>
    `;
    });
};

window.addEventListener("load", () => {
    init();
});
