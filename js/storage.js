// ============================================================
// storage.js - LocalStorage manager cho CV Builder
// ============================================================

const STORAGE_KEY = 'cv_builder_data';
const TEMPLATE_KEY = 'cv_builder_template';
const COLOR_KEY = 'cv_builder_colors';

const Storage = {
    save(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('Storage save failed:', e);
        }
    },

    load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.warn('Storage load failed:', e);
            return null;
        }
    },

    saveTemplate(id) {
        localStorage.setItem(TEMPLATE_KEY, String(id));
    },

    loadTemplate() {
        return parseInt(localStorage.getItem(TEMPLATE_KEY) || '1', 10);
    },

    saveColors(colorsMap) {
        localStorage.setItem(COLOR_KEY, JSON.stringify(colorsMap));
    },

    loadColors() {
        try {
            const raw = localStorage.getItem(COLOR_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    },

    clear() {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TEMPLATE_KEY);
        localStorage.removeItem(COLOR_KEY);
    }
};
