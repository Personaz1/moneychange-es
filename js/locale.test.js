/**
 * Test suite for locale module
 */

const locale = require('./locale.js');

// Mock localStorage for testing
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    removeItem: function(key) {
      delete store[key];
    },
    clear: function() {
      store = {};
    }
  };
})();

// Mock document for testing
const documentMock = {
  documentElement: {
    lang: null,
    setAttribute: jest.fn((attr, value) => {
      if (attr === 'lang') {
        documentMock.documentElement.lang = value;
      }
    })
  },
  querySelectorAll: jest.fn(() => []),
  getElementById: jest.fn(() => null)
};

// Save originals
const originalLocalStorage = global.localStorage;
const originalDocument = global.document;

describe('Locale Module', () => {
  beforeEach(() => {
    // Set up mocks
    global.localStorage = localStorageMock;
    global.document = documentMock;
    localStorage.clear();
  });

  afterEach(() => {
    // Restore originals
    global.localStorage = originalLocalStorage;
    global.document = originalDocument;
  });

  test('should have English and Spanish translations', () => {
    expect(locale.translations.en).toBeDefined();
    expect(locale.translations.es).toBeDefined();
  });

  test('should return translation for a given key', () => {
    // English
    expect(locale.getTranslation('home', 'en')).toBe('Home');
    expect(locale.getTranslation('contact', 'en')).toBe('Contact');
    
    // Spanish
    expect(locale.getTranslation('home', 'es')).toBe('Inicio');
    expect(locale.getTranslation('contact', 'es')).toBe('Contacto');
  });

  test('should return key when translation not found', () => {
    expect(locale.getTranslation('non_existent_key', 'en')).toBe('non_existent_key');
    expect(locale.getTranslation('non_existent_key', 'es')).toBe('non_existent_key');
  });

  test('should get current language from localStorage', () => {
    // Default is 'en'
    expect(locale.getCurrentLanguage()).toBe('en');
    
    // Set language to Spanish
    localStorage.setItem('language', 'es');
    expect(locale.getCurrentLanguage()).toBe('es');
  });

  test('should set language in localStorage', () => {
    locale.setLanguage('es');
    expect(localStorage.getItem('language')).toBe('es');
    expect(documentMock.documentElement.setAttribute).toHaveBeenCalledWith('lang', 'es');
    
    locale.setLanguage('en');
    expect(localStorage.getItem('language')).toBe('en');
    expect(documentMock.documentElement.setAttribute).toHaveBeenCalledWith('lang', 'en');
  });

  test('should not set invalid language', () => {
    localStorage.setItem('language', 'en');
    locale.setLanguage('fr'); // Invalid language
    expect(localStorage.getItem('language')).toBe('en'); // Should not change
  });
}); 