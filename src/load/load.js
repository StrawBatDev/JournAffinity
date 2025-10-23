import Storehouse from "storehouse-js";

export let loadLastContent = () => {
    return Storehouse.getItem(localStorage.localStorageNamespace, localStorage.localStorageKey);
};

export let saveLastContent = (content) => {
    let expiredAt = new Date(2099, 1, 1);
    Storehouse.setItem(localStorage.localStorageNamespace, localStorage.localStorageKey, content, expiredAt);
};

export let loadScrollBarSettings = () => {
    return Storehouse.getItem(localStorage.localStorageNamespace, localStorage.localStorageScrollBarKey);
};

export let loadToolBarSettings = () => {
    return Storehouse.getItem(localStorage.localStorageNamespace, localStorage.localStorageToolBarStyleKey);
};