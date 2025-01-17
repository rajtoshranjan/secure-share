import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Theme } from '../enums';
import { localStorageManager } from '../../lib/utils';

interface ThemeState {
  current: Theme;
}

const updateTheme = (theme: Theme) => {
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(theme);
  localStorageManager.setTheme(theme);
};

const getThemeFromLocalStorage = (): Theme => {
  const theme = (localStorageManager.getTheme() as Theme) || Theme.Light;
  updateTheme(theme);
  return theme;
};

const initialState: ThemeState = {
  current: getThemeFromLocalStorage(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.current === Theme.Dark ? Theme.Light : Theme.Dark;
      updateTheme(newTheme);
      state.current = newTheme;
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      updateTheme(action.payload);
      state.current = action.payload;
    },
  },
});

// Selectors
export const selectTheme = (state: { theme: ThemeState }) => state.theme;

export const { toggleTheme, setTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
