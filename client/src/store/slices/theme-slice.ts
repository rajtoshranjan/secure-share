import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Theme } from '../../hooks';

interface ThemeState {
  current: Theme;
}

// Helper function to update theme in DOM and localStorage.
const updateTheme = (theme: Theme) => {
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(theme);
  localStorage.setItem('theme', theme);
};

const getThemeFromLocalStorage = (): Theme => {
  const theme = (localStorage.getItem('theme') as Theme) || Theme.Light;
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

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
