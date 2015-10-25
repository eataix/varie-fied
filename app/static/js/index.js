require('babel/register');

import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import app from './redux/reducers';
import FrontPage from './FrontPage';

(() => {
  'use strict';

  const store = createStore(app);
  console.log(store.getState());

  store.subscribe(() => {
      console.log(store.getState());
    }
  );

  render(
    <Provider store={store}>
      <FrontPage />
    </Provider>,
    document.getElementById('content')
  );

})();

