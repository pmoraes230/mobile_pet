import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@coracao_em_patas_theme';

let currentThemeMode = 'light';
let stylePatchInstalled = false;

const ThemeContext = createContext({
  themeMode: 'light',
  isDarkMode: false,
  setThemeMode: () => {},
  toggleThemeMode: () => {},
});

const darkColorMap = {
  '#f8f9fd': '#0F1020',
  '#f5f5f5': '#0F1020',
  '#f9fafb': '#0F1020',
  '#f8fafc': '#0F1020',
  '#ffffff': '#17182B',
  '#fff': '#17182B',
  'white': '#17182B',
  '#f3f1ff': '#111124',
  '#f8f8ff': '#1A1B2E',
  '#f5f3ff': '#1B1830',
  '#f3f5f9': '#202238',
  '#f3f4f6': '#202238',
  '#f1f3f4': '#202238',
  '#f7f8fb': '#202238',
  '#f9f9f9': '#202238',
  '#e8d5f7': '#2A1D42',
  '#f5e6ff': '#2A1D42',
  '#f3e8ff': '#2A1D42',
  '#f0e6ff': '#2A1D42',
  '#faf5ff': '#211936',
  '#e2e8f0': '#2A2D45',
  '#e5e7eb': '#2A2D45',
  '#f0f0f0': '#2A2D45',
  '#f0f0f5': '#2A2D45',
  '#e9d7ff': '#4B3471',
  '#d8b4fe': '#68429B',
  '#0d214f': '#F5F7FF',
  '#111': '#F5F7FF',
  '#111827': '#F5F7FF',
  '#1a1a1b': '#F5F7FF',
  '#1a1a2e': '#F5F7FF',
  '#18264b': '#F5F7FF',
  '#000': '#F5F7FF',
  '#333': '#DDE3F5',
  '#323232': '#DDE3F5',
  '#374151': '#DDE3F5',
  '#4a5568': '#DDE3F5',
  '#4b5563': '#DDE3F5',
  '#666': '#AEB6CC',
  '#6b7280': '#AEB6CC',
  '#777': '#AEB6CC',
  '#7e869e': '#AEB6CC',
  '#808080': '#AEB6CC',
  '#888': '#AEB6CC',
  '#999': '#AEB6CC',
  '#a0a7ba': '#8E98B5',
  '#9ca3af': '#8E98B5',
  '#b0b8c5': '#77819E',
  '#9127e1': '#B77CFF',
  '#9333ea': '#B77CFF',
  '#7c3aed': '#B77CFF',
  '#f0fdf4': '#14301F',
  '#fefce8': '#332B12',
  '#fef2f2': '#351923',
  '#fff6f6': '#351923',
  '#eff6ff': '#16233B',
  '#fff4ee': '#352113',
  '#fff4d6': '#342A13',
  '#fff4e6': '#352313',
  '#ffe4e8': '#341822',
  '#e3f5ea': '#173123',
  '#e6fffa': '#14332F',
  '#eef2ff': '#202546',
};

const colorKeys = new Set([
  'backgroundColor',
  'borderColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'color',
  'textDecorationColor',
  'tintColor',
]);

const darkSurfaceColors = new Set([
  '#0b1020',
  '#0f1020',
  '#0f172a',
  '#111827',
  '#17182b',
  '#172033',
  '#202238',
  '#241a3d',
  '#2a1d42',
  '#2a2d45',
]);

const lightTextColors = new Set([
  '#ffffff',
  '#fff',
  'white',
  '#f8fafc',
  '#f5f7ff',
  '#eef2ff',
  '#e8ecf7',
  '#dde3f5',
  '#d6dbe8',
  '#cbd5e1',
  '#aeb6cc',
  '#aab4c5',
  '#8e98b5',
]);

function mapColor(key, value) {
  if (typeof value !== 'string') return value;

  const normalized = value.trim().toLowerCase();

  if (key !== 'color' && key !== 'tintColor' && darkSurfaceColors.has(normalized)) {
    return value;
  }

  if ((key === 'color' || key === 'tintColor') && lightTextColors.has(normalized)) {
    return value;
  }

  if (key === 'shadowColor') return value;

  return darkColorMap[normalized] || value;
}

function createDarkStyle(style) {
  if (!style || typeof style !== 'object' || Array.isArray(style)) return style;

  const nextStyle = { ...style };

  Object.keys(nextStyle).forEach((key) => {
    if (colorKeys.has(key)) {
      nextStyle[key] = mapColor(key, nextStyle[key]);
    }
  });

  return nextStyle;
}

function createDarkStyleSheet(styles) {
  if (!styles || typeof styles !== 'object') return styles;

  return Object.entries(styles).reduce((acc, [key, style]) => {
    acc[key] = createDarkStyle(style);
    return acc;
  }, {});
}

export function setRuntimeThemeMode(mode) {
  currentThemeMode = mode === 'dark' ? 'dark' : 'light';
}

export function installThemeStylePatch() {
  if (stylePatchInstalled) return;

  const originalCreate = StyleSheet.create.bind(StyleSheet);
  const originalFlatten = StyleSheet.flatten.bind(StyleSheet);

  StyleSheet.create = (styles) => {
    const lightStyles = originalCreate(styles);
    const darkStyles = originalCreate(createDarkStyleSheet(styles));

    return Object.keys(lightStyles).reduce((acc, key) => {
      Object.defineProperty(acc, key, {
        enumerable: true,
        configurable: true,
        get() {
          return currentThemeMode === 'dark' ? darkStyles[key] : lightStyles[key];
        },
      });

      return acc;
    }, {});
  };

  StyleSheet.flatten = (style) => {
    const flattened = originalFlatten(style);
    return currentThemeMode === 'dark' ? createDarkStyle(flattened) : flattened;
  };

  stylePatchInstalled = true;
}

export function ThemeProvider({ children }) {
  const [themeMode, setThemeModeState] = useState('light');
  const [themeVersion, setThemeVersion] = useState(0);

  installThemeStylePatch();
  setRuntimeThemeMode(themeMode);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(THEME_STORAGE_KEY).then((storedTheme) => {
      if (mounted && (storedTheme === 'dark' || storedTheme === 'light')) {
        setRuntimeThemeMode(storedTheme);
        setThemeModeState(storedTheme);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const setThemeMode = async (mode) => {
    const nextMode = mode === 'dark' ? 'dark' : 'light';

    setRuntimeThemeMode(nextMode);
    setThemeModeState(nextMode);
    setThemeVersion((version) => version + 1);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, nextMode);
  };

  const value = useMemo(() => ({
    themeMode,
    themeVersion,
    isDarkMode: themeMode === 'dark',
    setThemeMode,
    toggleThemeMode: () => setThemeMode(themeMode === 'dark' ? 'light' : 'dark'),
  }), [themeMode, themeVersion]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}

installThemeStylePatch();
