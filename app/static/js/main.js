(() => {
  $.fn.editable.defaults.mode = 'inline';

  $(document).on('ready', () => {
    $.material.init();
  });

  /* eslint-disable */
  (function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    //noinspection CommaExpressionJS
    i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
      }, i[r].l = 1 * new Date();
    //noinspection CommaExpressionJS
    a = s.createElement(o),
      m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
  })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

  ga('create', 'UA-67200722-1', 'auto');
  ga('send', 'pageview');
  /* eslint-enable */
})();

