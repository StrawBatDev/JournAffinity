let navigationPickerWindow = null;

export function openNavigationPicker() {
    if (navigationPickerWindow && !navigationPickerWindow.closed) {
        navigationPickerWindow.focus();
    } else {
        navigationPickerWindow = window.open(
            'src/navigationPicker.html',
            'Navigation Picker',
            'width=500,height=450,resizable=yes'
        );
    }
}
