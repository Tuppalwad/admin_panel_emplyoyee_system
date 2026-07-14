import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store, { persistor } from './redux/store';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate
        loading={null} // No loading component displayed
        persistor={persistor}
        onBeforeLift={() => {
          // Perform any actions before the app is rendered
        }}
      >
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
