import React from 'react';
import Beefweb from './classes/BeefWeb';
import Settings from './classes/Settings';

interface AppContextType {
  BeefWeb: Beefweb;
  Settings: Settings
}

// Create a default value to prevent undefined errors before the provider is set
const defaultContext: AppContextType = {
  BeefWeb: new Beefweb(),
  Settings: new Settings()
};

// Create and export the context
export  const AppContext = React.createContext<AppContextType>(defaultContext);
