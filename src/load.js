import Storehouse from "storehouse-js";

export const localStorageNamespace = 'com.markdownlivepreview';
export const localStorageKey = 'last_state';
export const localStorageScrollBarKey = 'scroll_bar_settings';
export const localStorageToolBarStyleKey = 'tool_bar_style_settings';

export const loadLastContent = () =>
    Storehouse.getItem(localStorageNamespace, localStorageKey);

export const saveLastContent = (content) => {
    const expiredAt = new Date(2099, 1, 1);
    Storehouse.setItem(localStorageNamespace, localStorageKey, content, expiredAt);
};

export const loadScrollBarSettings = () =>
    Storehouse.getItem(localStorageNamespace, localStorageScrollBarKey) || false;

export const saveScrollBarSettings = (settings) => {
    const expiredAt = new Date(2099, 1, 1);
    Storehouse.setItem(localStorageNamespace, localStorageScrollBarKey, settings, expiredAt);
};

export const loadToolBarSettings = () =>
    Storehouse.getItem(localStorageNamespace, localStorageToolBarStyleKey) || false;

export const saveToolbarStyleSettings = (settings) => {
    const expiredAt = new Date(2099, 1, 1);
    Storehouse.setItem(localStorageNamespace, localStorageToolBarStyleKey, settings, expiredAt);
};