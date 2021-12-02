"use strict";
export const local = {
    get(key) {
        let value = window.localStorage.getItem(key);
        return JSON.parse(value);
    },
    set(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
        window.localStorage.removeItem(key);
    },
    clear() {
        window.localStorage.clear();
    },
};

export const session = {
    get(key) {
        let value = window.sessionStorage.getItem(key);
        return JSON.parse(value);
    },
    set(key, value) {
        window.sessionStorage.setItem(key, JSON.stringify(value));
    },
    remove(key) {
        window.sessionStorage.removeItem(key);
    },
    clear() {
        window.sessionStorage.clear();
    },
};