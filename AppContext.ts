import React from 'react';
import Beefweb from './classes/BeefWeb';


interface AppContextType {
  BeefWeb: Beefweb;
}

// Create a default value to prevent undefined errors before the provider is set
const defaultContext: AppContextType = {
  BeefWeb: new Beefweb(),
};

// Create and export the context
export  const AppContext = React.createContext<AppContextType>(defaultContext);
