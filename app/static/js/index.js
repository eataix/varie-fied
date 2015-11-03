import React from 'react'; // eslint-disable-line no-unused-vars
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import app from './redux/reducers';
import FrontPage from './FrontPage';

(() => {
  const store = createStore(app);
  console.log(store.getState());

  store.subscribe(() => {
    console.log(store.getState());
  });

  render(
    <Provider store={store}>
      <FrontPage />
    </Provider>,
    document.getElementById('content')
  );
})();

