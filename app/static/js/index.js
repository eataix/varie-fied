import './main';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { createStore } from 'redux';

import FrontPage from './FrontPage';
import app from './redux/reducers';

(() => {
  'use strict';

  const store = createStore(app);
  console.log(store.getState());

// Every time the state changes, log it
  let unsubscribe = store.subscribe(() =>
    console.log(store.getState())
  );

  render(
    <Provider store={store}>
      <FrontPage />
    </Provider>,
    document.getElementById('content')
  );
})();
