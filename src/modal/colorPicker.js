let colorPickerWindow = null;

export function openColorPicker(editor, tag) {
    if (colorPickerWindow && !colorPickerWindow.closed) {
        colorPickerWindow.focus();
    } else {
        colorPickerWindow = window.open(
            '/src/modal/colorPicker.html', // update path
            'Color Picker',
            'width=300,height=400,resizable=yes'
        );
    }
}
