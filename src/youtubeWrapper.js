export function registerYoutubeWrapperClick() {
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
}