import 'babel-polyfill';

import React from 'react'; // eslint-disable-line no-unused-vars
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import ProjectPage from './ProjectPage';
import app from './redux/reducers';
import init from './main';

(() => {

  const store = createStore(app);
  console.log(store.getState()); // eslint-disable-line no-console

  store.subscribe(() => {
    console.log(store.getState()); // eslint-disable-line no-console
  });

  render(
    <Provider store={store}>
      <ProjectPage progress={false}/>
    </Provider>,
    document.getElementById('content')
  );

  init();
})();

