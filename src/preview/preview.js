import DOMPurify from "dompurify";

const a_href_fa_username = (user) => `
<a href="https://www.furaffinity.net/user/${user}" class="fa-username">`;

const img_src_user_gif = (user) => `
<img src="https://a.facdn.net/${user}.gif"
    alt="${user}"
    class="fa-icon"
    onerror="this.style.display='none'">`

const faMention = (user, {includeGif = false, single = false} = {}) => `
<span class="fa-mention${single ? ' single' : ''}">
    ${a_href_fa_username(user)}
    ${includeGif ? img_src_user_gif(user) : ''}
    ${single ? '' : ` ${user}`}
    </a>
</span>`

// ⚠️ The order here is deliberate and important!
const bbcode = [
    {id: 'Normalize line endings', html: "\n", regex: /\r\n?/g},
    {id: 'Convert to breaks', html: "<br>", regex: /\n/g},
    ...makeWrappers([1, 2, 3, 4, 5], {prefix: 'h', classPrefix: 'h'}),
    {id: 'Remove breaks right after headers', html: '$1', regex: /(<\/h[1-6]>)<br>/gi},
    ...makeWrappers(['b', 'i', 'u', 's']),
    {id: 'Spoiler', html: '<span class="bbcode_spoiler">$1</span>', regex: /\[spoiler](.*?)\[\/spoiler]/gi},
    {id: 'Quote', html: '<span class="bbcode_quote">$1</span>', regex: /\[quote](.*?)\[\/quote]/gi},
    {id: 'left', html: '<div class="bbcode_left">$1</div>', regex: /\[left](.*?)\[\/left]/gi},
    {id: 'center', html: '<div class="bbcode_center">$1</div>', regex: /\[center](.*?)\[\/center]/gi},
    {id: 'right', html: '<div class="bbcode_right">$1</div>', regex: /\[right](.*?)\[\/right]/gi},
    {id: 'Copyright Symbol', html: '©', regex: /\(c\)/gi},
    {id: 'Trademark Symbol', html: '™', regex: /\(tm\)/gi},
    {id: 'Registered Symbol', html: '®', regex: /\(r\)/gi},
    {
        id: 'Url=',
        html: '<a href="$1" class="bbcode_link" target="_blank" rel="noopener noreferrer">$2</a>',
        regex: /\[url=(https?:\/\/[^\]]+)](.*?)\[\/url]/gi,
    },
    {
        id: 'Url',
        html: '<a href="$1" class="bbcode_link" target="_blank" rel="noopener noreferrer">$1</a>',
        regex: /\[url](https?:\/\/[^\]]+)\[\/url]/gi,
    },
    {
        id: 'Color=',
        html: '<span class="bbcode_color" style="color:$1;">$2</span>',
        regex: /\[color=(#[0-9A-F]{3,6}|[a-z]+)](.*?)\[\/color]/gi,
    },
    {
        id: '🐭Username',
        html: (_, user) => faMention(user, {includeGif: true}),
        regex: /@@([a-z0-9_-]+)/gi,
    },
    {
        id: 'Username',
        html: (_, user) => faMention(user, {single: true}),
        regex: /@([a-zA-Z0-9_-]+)/gi,
    },
    {
        id: '🐭Username(Legacy)',
        html: (_, user) => faMention(user, {includeGif: true}),
        regex: /:icon([a-z0-9_-]+):/gi,
    },
    {
        id: '🐭',
        html: (_, user) => faMention(user, {includeGif: true, single: true}),
        regex: /:([a-z0-9_-]+)icon:/gi,
    },
    {
        id: 'sup',
        html: '<sup>$1</sup>',
        regex: /\[sup](.*?)\[\/sup]/gi,
    },
    {
        id: 'sub',
        html: '<sub>$1</sub>',
        regex: /\[sub](.*?)\[\/sub]/gi,
    },
    {
        id: 'line',
        html: '<hr class="bbcode bbcode_hr">',
        regex: /-{5,}/g,
    },
];

function makeWrappers(tags, {prefix = '', classPrefix = ''} = {}) {
    return tags.map((tag) => {
        const id = prefix ? `${prefix}${tag}` : tag.charAt(0).toUpperCase() + tag.slice(1);
        const htmlTag = prefix ? `${prefix}${tag}` : tag;
        const className = classPrefix ? `bbcode_${classPrefix}${tag}` : `bbcode_${tag}`;
        return {
            id,
            html: `<${htmlTag} class="${className}">$1</${htmlTag}>`,
            regex: new RegExp(`\\[${htmlTag}](.*?)\\[\\/${htmlTag}]`, 'gi'),
        };
    });
}

function parseYouTube(src) {
    if (!src) return "";
    return src.replace(/\[yt](https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+))\[\/yt]/gi, (_, fullUrl, videoId) => {
        return `
        <div class="youtubeWrapper" data-video="${videoId}">
            <div class="youtubeWrapper__thumbnailContainer">
                <img class="youtubeWrapper__thumbnail" src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" alt="YouTube Video">
                <div class="youtubeWrapper__playButton"></div>
            </div>
        </div>`;
    });
}

function preview(src) {
    if (!src) return "";
    src = parseYouTube(src)
    bbcode.forEach((bbcode) => {
        src = src.replace(bbcode.regex, bbcode.html)
    })
    return src
}

export let convertBbcodeToHtml = async (input) => {
    let html = await new Promise((resolve) => {
        resolve((preview(input)));
    });
    document.querySelector('#output').innerHTML = DOMPurify.sanitize(html);
};
