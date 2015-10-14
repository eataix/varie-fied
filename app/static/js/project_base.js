(() => {
  'use strict';

  //$.fn.editable.defaults.mode = 'inline';

  const $table = $('#table');

  $table.on('editable-save.bs.table', () => {
    $('#btn-save').prop('disabled', false);
  });

  $table.on('check.bs.table check-all.bs.table check-some.bs.table', () => {
    $('#btn-delete').prop('disabled', false);
  });

  $table.on('uncheck-all.bs.table', () => {
    $('#btn-delete').prop('disabled', true);
  });

  $table.on('uncheck.bs.table	uncheck-some.bs.table', () => {
    const selected = $table.bootstrapTable('getSelections');
    if (selected.length === 0) {
      $('#btn-delete').prop('disabled', true);
    }
  });
})();
