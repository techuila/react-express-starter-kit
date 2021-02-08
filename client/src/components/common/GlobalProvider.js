import React, { useEffect, useState } from 'react';
import { observer, inject } from 'mobx-react'; //These functions make our components observable and be able to use the store

//Ant D
import { ConfigProvider } from 'antd';
//Moment
import moment from 'moment';
//translation
import de_DE from 'antd/es/locale/de_DE';
import enUS from 'antd/es/locale/en_US';

function GlobalProvider(props) {
  const lang = props.store.language;

  const [locale, setLocale] = useState(localStorage.getItem('locale') || de_DE);

  useEffect(() => {
    if (lang === 'en') {
      setLocale(enUS);
      //  moment.locale("en");
    }
    if (lang === 'de') {
      setLocale(de_DE);
      //  moment.locale("de");
    }
    return () => {};
  }, [lang]);

  return <ConfigProvider locale={locale}>{props.children}</ConfigProvider>;
}

export default inject('store')(observer(GlobalProvider));
