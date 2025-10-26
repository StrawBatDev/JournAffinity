let colorPickerWindow = null;

export function openColorPicker() {
    if (colorPickerWindow && !colorPickerWindow.closed) {
        colorPickerWindow.focus();
    } else {
        colorPickerWindow = window.open(
            './src/colorPicker.html',
            'Color Picker',
            'width=300,height=400,resizable=yes'
        );
    }
}
