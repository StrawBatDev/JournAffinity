let mentionPickerWindow = null;

export function openMentionPicker() {
    if (mentionPickerWindow && !mentionPickerWindow.closed) {
        mentionPickerWindow.focus();
    } else {
        mentionPickerWindow = window.open(
            './src/mentionPicker.html', // update path
            'Mention Picker',
            'width=300,height=500,resizable=yes'
        );
    }
}

const options = document.querySelectorAll('.mention-preview-inline');
options.forEach(option => {
    option.addEventListener('click', () => {
        // Remove selected class from all
        options.forEach(o => o.classList.remove('selected'));
        // Add selected class to this one
        option.classList.add('selected');

        // Do whatever you need with the chosen format
        insertIntoEditor(option.dataset.type);
    });
});