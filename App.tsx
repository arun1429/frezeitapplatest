import 'react-native-gesture-handler'; // 🔴 MUST be first

import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';

import { store } from './src/store';
import RootNavigation from './src/navigation/RootNavigation';

const App = () => {
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <RootNavigation />
      </PaperProvider>
    </ReduxProvider>
  );
};

export default App;
