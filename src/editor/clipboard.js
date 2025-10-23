export let copyToClipboard = (text, successHandler, errorHandler) => {
    navigator.clipboard.writeText(text).then(
        () => {
            successHandler();
        },
        () => {
            errorHandler();
        }
    );
};

export let notifyCopied = () => {
    let labelElement = document.querySelector("#copy-button a");
    labelElement.innerHTML = "Copied!";
    setTimeout(() => {
        labelElement.innerHTML = "Copy";
    }, 1000)
};