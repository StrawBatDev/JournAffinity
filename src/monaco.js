// Disables Monaco’s language workers as we aren't using them.
export function disableMonacoLanguageWorker() {
    self.MonacoEnvironment = {
        getWorker(_, label) {
            return new Worker(
                URL.createObjectURL(new Blob(['self.onmessage = () => {}'], {type: 'application/javascript'}))
            );
        }
    };
}