import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import FrontPage from './FrontPage';
import app from './redux/reducers';

let store = createStore(app);

(() => {
  'use strict';
  render(
    <Provider store={store}>
      <FrontPage />
    </Provider>,
    document.getElementById('content')
  );
})();
