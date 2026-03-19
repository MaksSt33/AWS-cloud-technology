import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './components/App';

import { applyMiddleware, createStore } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from './reducer';

import './style/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'toastr/build/toastr.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const configureStore = initialState => {
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk)
    );
};

const store = configureStore();

const root = createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
