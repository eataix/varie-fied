import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import app from './redux/reducers';
import ProjectPage from './ProjectPage';


(() => {
  'use strict';

  const store = createStore(app);
  console.log(store.getState());

  let unsubscribe = store.subscribe(() => {
      console.log(store.getState());
    }
  );
  render(
    <Provider store={store}>
      <ProjectPage
        progress={true}
      />
    </Provider>,
    document.getElementById('content')
  );
})();

