import './main';

import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import FrontPage from './FrontPage';
import app from './redux/reducers';

(() => {
  'use strict';

  const store = createStore(app);
  console.log(store.getState());

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
