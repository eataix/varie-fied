const metaData = $('#meta-data').data();
//noinspection JSUnresolvedVariable
const newProjectUrl = metaData.newProjectUrl;
//noinspection JSUnresolvedVariable
const newVariationUrl = metaData.newVariationUrl;
//noinspection JSUnresolvedVariable
const newItemUrl = metaData.newItemUrl;
//noinspection JSUnresolvedVariable
const newClientUrl = metaData.newClientUrl;
//noinspection JSUnresolvedVariable
const newProgressItemUrl = metaData.newProgressItemUrl;

function isNull(element) {
  'use strict';
  return element === null;
}

function isTrue(element) {
  'use strict';
  return element === true;
}

function isFalse(element) {
  'use strict';
  return element === false;
}

(() => {
  'use strict';

  $(document).on('ready', () => {
    $.material.init();
    $('body').addClass('loaded');
  });

  (function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
          (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
  })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

  ga('create', 'UA-67200722-1', 'auto');
  ga('send', 'pageview');
})(); // invoke
