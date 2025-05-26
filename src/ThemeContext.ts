// ThemeContext.tsx
import React, { createContext, useContext } from "react";
import { AppTheme } from './classes/Settings'

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}

export default createContext<ThemeContextType>({
  theme: AppTheme.Light,
  setTheme: () => {},
});
