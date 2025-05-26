import React from 'react';
import Beefweb from './classes/BeefWeb';
import Settings from './classes/Settings';

interface AppContextType {
  BeefWeb: Beefweb;
  Settings: Settings;
}

const defaultContext: AppContextType = {
  BeefWeb: new Beefweb(),
  Settings: new Settings(),
};

export const AppContext = React.createContext<AppContextType>(defaultContext);
