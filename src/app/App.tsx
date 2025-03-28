import React from 'react';
import { Provider } from 'react-redux';
import { store } from './providers/store';
import GraphPage from '../pages/GraphPage';

function App() {
  return (
    <Provider store={store}>
      <GraphPage />
    </Provider>
  );
}

export default App;
