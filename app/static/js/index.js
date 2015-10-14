const React = require('react');
const ReactDOM = require('react-dom');

const FrontPage = require('./FrontPage');

(() => {
  'use strict';
  ReactDOM.render(
    <FrontPage />,
    document.getElementById('content')
  );
})();
