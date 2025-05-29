import React from 'react';
import Beefweb from './classes/BeefWeb';
import Settings, { AppTheme } from './classes/Settings';

export interface AppContextType {
  BeefWeb: Beefweb;
  Settings: Settings;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}
 const defaultContext: AppContextType = {
  BeefWeb: new Beefweb(),
  Settings: new Settings(),
  theme: AppTheme.Light,
  setTheme: () => {},
};

export default React.createContext<AppContextType>(defaultContext);
