import React from 'react';
import {Provider} from 'react-redux';
import {store} from './src/store/index';
import RootNavigation from './src/navigation/RootNavigation';

const App = () => {
  return (
    <Provider store={store}>
      <RootNavigation />
    </Provider>
  );
};

export default App;
