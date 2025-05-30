import React from 'react';
import Beefweb from './classes/BeefWeb';
import Settings, { AppTheme } from './classes/Settings';
import { Orientation } from 'hooks/useOrientation';

export interface AppContextType {
  BeefWeb: Beefweb;
  Settings: Settings;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  orientation: Orientation
}
 const defaultContext: AppContextType = {
  BeefWeb: new Beefweb(),
  Settings: new Settings(),
  theme: AppTheme.Light,
  setTheme: () => {},
  orientation: 'unknown'
};

export default React.createContext<AppContextType>(defaultContext);
