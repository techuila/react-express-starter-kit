import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import RootStore from './models/RootStore';
import LoginModel from './models/LoginModel';
import GlobalProvider from './components/common/GlobalProvider';

//Translation
import translationEng from './translations/en/translation.json';
import translationDe from './translations/de/translation.json';

import './index.css';

import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';

import App from './components/App';
import * as serviceWorker from './serviceWorker';

const store = RootStore.create({
  language: localStorage.getItem('lang') || 'de',
  login: LoginModel.create({
    id: 0,
    token: localStorage.getItem('token') || '',
    email: '',
    firstName: '',
    lastName: '',

    companyId: 0,
    position: '',

    isLoggedIn: localStorage.getItem('token') ? true : false,
    isAdmin: false,
  }),
  localUnits: {},
});
store.initialize();

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: store.language, // language to use
  resources: {
    en: {
      common: translationEng, // 'common' is our custom namespace
    },
    de: {
      common: translationDe,
    },
  },
  fallbackLng: 'de',

  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',
  react: {
    wait: true,
  },
});

ReactDOM.render(
  <Provider store={store}>
    <GlobalProvider>
      <I18nextProvider i18n={i18next}>
        <App />
      </I18nextProvider>
    </GlobalProvider>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
serviceWorker.register();
