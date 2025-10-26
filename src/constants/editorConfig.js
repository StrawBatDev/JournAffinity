export const BBCODE_MONACO_LANGUAGE_ID = "preview"

export const confirmationMessage = 'Are you sure you want to reset? Your changes will be lost.';

export const SUPPORTED_TAGS = [
    'b', 'i', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'left', 'center', 'right', 'sub', 'sup', 'quote', '-----',
    'color'
];

export const MENTION_PATTERNS = [
    /^@(\w+)$/,                     // @username
    /^:(\w+)icon:$/,                // :usernameicon:
    /^:icon(\w+):$/,                // :iconusername:
    /^@([a-zA-Z0-9_-]+):\1icon:/,   // usernameicon:@username
];

export const NAVIGATION_PATTERN = /\[\s*([0-9\-]+)\s*,\s*([0-9\-]+)\s*,\s*([0-9\-]+)\s*\]/;

export const TAG_PATTERN = [
    '\\[',          // opening bracket
    '/?',           // optional slash
    '(', SUPPORTED_TAGS.join('|'), ')', // supported tags
    '(=[^\\]]+)?',  // optional =value
    '\\]'           // closing bracket
].join('');

export const DEFAULT_INPUT = `[h1]JournAffinity v1.0[/h1]
Hi, I am :strawbaticon: and this is an [b]WYSIWYG editor[/b] I made to help you write journals and post descriptions on Furaffinity.net!

If you like this software,  [b][url=https://ko-fi.com/strawbat$0][color=orange]consider supporting my work and make a donation to my Ko-Fi. Thank you[/color][/url][/b]

[h2]Dorky stuff translated for the layman:[/h2]
[b]Furaffinity.net[/b] uses what are called [b]BBCodes[/b] for formatting text; 
BBCode is a lightweight markup language used on many online forums and bulletin boards to format posts.

What I am doing is converting these BBCodes using Regex (Shorthand for 'regular expression') and converting them into HTML (Shorthand for hypertext markup language)
This text is then previewed using CSS (Shorthand for 'Cascading Style Sheets'), heavily inspired by Furaffinity.net's CSS circa 2025.

What you see in the preview should [i]approximate[/i] what you will see on Furaffinity.net when you post.

Things left to add:
- Link url button for inserting links
- Swap showing windows in favour of in page dialogs; this should fix the 'orphaning' issue which may be annoying to users.
- Add a preview to show submissions when inserting the sequence navigation links.
- Fix the preview of youtube videos, the thumbnails are misaligned. Functional, but not acurate.

[h2]Sauces:[/h2]
The BBCodes that this editor can preview have been based on this [url=https://www.furaffinity.net/journal/8342081/]journal[/url] and [url=https://www.furaffinity.net/help/#tags-and-codes]Furaffinity.net's official documentation[/url]

This is forked from another project here: https://markdownlivepreview.com

-----
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
[b][url=https://www.youtube.com/watch?v=CzVeai1P1H0$0][color=orange]Simon - "They're going to combine?!"[/color][/url][/b]
    
Video links (Only in journals!)
[yt]https://www.youtube.com/watch?v=CzVeai1P1H0[/yt]
`;