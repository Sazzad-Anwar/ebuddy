import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ToastProvider } from 'react-toast-notifications';
import App from './App';
import store from './Redux/store';
import reportWebVitals from './reportWebVitals';
import * as ServiceWorkerRegistration from './serviceWorkerRegistration';

ReactDOM.render(
    <Provider store={store}>
        <ToastProvider>
            <App />
        </ToastProvider>
    </Provider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
ServiceWorkerRegistration.register();
