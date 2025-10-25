import Storehouse from "storehouse-js";
import * as localStorage from "../constants/localStorage";

export const loadLastContent = () =>
    Storehouse.getItem(localStorage.localStorageNamespace, localStorage.localStorageKey);

export const saveLastContent = (content) => {
    const expiredAt = new Date(2099, 1, 1);
    Storehouse.setItem(localStorage.localStorageNamespace, localStorage.localStorageKey, content, expiredAt);
};

export const loadScrollBarSettings = () =>
    Storehouse.getItem(localStorage.localStorageNamespace, localStorage.localStorageScrollBarKey) || false;

export const saveScrollBarSettings = (settings) => {
    const expiredAt = new Date(2099, 1, 1);
    Storehouse.setItem(localStorage.localStorageNamespace, localStorage.localStorageScrollBarKey, settings, expiredAt);
};

export const loadToolBarSettings = () =>
    Storehouse.getItem(localStorage.localStorageNamespace, localStorage.localStorageToolBarStyleKey) || false;

export const saveToolbarStyleSettings = (settings) => {
    const expiredAt = new Date(2099, 1, 1);
    Storehouse.setItem(localStorage.localStorageNamespace, localStorage.localStorageToolBarStyleKey, settings, expiredAt);
};