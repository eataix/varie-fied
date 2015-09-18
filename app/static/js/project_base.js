var metaData = $('#project-data').data();
var newProgressItemUrl = metaData.newProgressItemUrl;

$.fn.editable.defaults.mode = 'inline';

$('#delete_project').on('click', function() {
  'use strict';
  swal({
    title: 'Are you sure to delete the project?',
    text: 'You are going to',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel plx!',
    closeOnConfirm: false,
    closeOnCancel: false,
    customClass: 'deleteConfirmation'
  }, function(isConfirm) {
    if (!isConfirm) {
      swal('Cancelled', 'Your project is safe :)', 'error');
      return;
    }
    var $button = $('.deleteConfirmation').find('.confirm');
    var html = $button.html();
    $button.html('<i class="fa fa-spinner fa-spin"></i> ' + html);
    $button.off('click');

    $.ajax({
      url: deleteProjectUrl,
      type: 'DELETE',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json'
    }).done(function() {
      swal({
        title: 'Nice!',
        text: 'You delete: ' + projectName,
        type: 'success'
      }, function() {
        window.location.href = '/';
      });
    });
  });
});

$('#archive_project').on('click', function() {
  'use strict';
  var action = 'archive';
  swal({
    title: 'Are you sure to ' + action + ' the project?',
    text: 'You can recover this project later!',
    type: 'info',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Yes, ' + action + ' it!',
    cancelButtonText: 'No, cancel plx!',
    closeOnConfirm: false,
    closeOnCancel: false,
    customClass: 'archiveConfirmation'
  }, function(isConfirm) {
    if (!isConfirm) {
      swal('Cancelled', 'The project file is safe :)', 'error');
      return;
    }
    var $button = $('.archiveConfirmation').find('.confirm');
    var html = $button.html();
    $button.html('<i class="fa fa-spinner fa-spin"></i> ' + html);
    $button.off('click');

    var active = projectActive !== 'True';
    $.ajax({
      url: editProjectUrl,
      type: 'PUT',
      data: JSON.stringify({
        active: active
      }),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json'
    }).done(function() {
      swal({
        title: 'Nice!',
        text: 'You ' + action + ': ' + projectName,
        type: 'success'
      }, function() {
        location.reload();
      });
    });
  });
});


$('#btn-add-new-progress-items').on('click', function() {
  'use strict';
  var instance = $('#new-progress-items-form').parsley();
  instance.validate();
  if (instance.isValid()) {
    swal({
      title: 'Are you sure to delete selected rows?',
      text: 'You cannot recover them later!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'teal',
      confirmButtonText: 'Yes, save them!',
      cancelButtonText: 'No, cancel plx!',
      closeOnConfirm: false,
      closeOnCancel: false,
      customClass: 'deleteRowsConfirmation'
    }, function(isConfirmed) {
      if (!isConfirmed) {
        swal('Cancelled', 'Your project is safe :)', 'error');
        return;
      }

      var $progressItems = $('.progressItem');

      function createItem(offset) {
        if (offset >= $progressItems.length) {
          return true;
        }
        var $o = $($progressItems[offset]);
        var name = $o.find('textarea').val();
        var contract_value = accounting.parse($o.find('input').val());

        var successful = true;
        $.ajax({
          url: newProgressItemUrl,
          type: 'POST',
          data: JSON.stringify({
            name: name,
            contract_value: contract_value,
            project_id: projectId
          }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json'
        }).done(function(res) {
          //console.log(res);
          successful = createItem(offset + 1);
        }).fail(function() {
          successful = false;
        });
        return successful;
      }

      var status = createItem(0);

      if (status) {
        swal({
          title: 'Nice!',
          text: 'You saved all changes',
          type: 'success'
        }, function() {
          location.reload();
        });
      }
    });
  }
});

$('#btn-save-meta').on('click', function() {
  'use strict';
  var instance = $('#edit-project-meta-form').parsley();
  instance.validate();
  if (instance.isValid()) {
    swal({
      title: 'Are you sure to save the changes?',
      text: 'You cannot recover them later!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'teal',
      confirmButtonText: 'Yes, save them!',
      cancelButtonText: 'No, cancel plx!',
      closeOnConfirm: false,
      closeOnCancel: false,
      customClass: 'saveMetaConfirmation'
    }, function(isConfirmed) {
      if (!isConfirmed) {
        swal('Cancelled', 'Your project is safe :)', 'error');
        return;
      }
      var $button = $('.saveMetaConfirmation').find('.confirm');
      var html = $button.html();
      $button.html('<i class="fa fa-spinner fa-spin"></i> ' + html);
      $button.off('click');

      var new_name = $('#new_name').val();
      var new_margin = $('#new_margin').val();
      var new_reference_number = $('#new_ref_number').val();
      var new_admin_fee = $('#new_admin_fee').val();
      if (new_admin_fee === '') {
        new_admin_fee = null;
      }
      $.ajax({
        url: editProjectUrl,
        type: 'PUT',
        data: JSON.stringify({
          name: new_name,
          margin: new_margin,
          admin_fee: new_admin_fee,
          reference_number: new_reference_number
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
      }).done(function() {
        swal({
          title: 'Nice!',
          text: 'Save changes',
          type: 'success'
        }, function() {
          location.reload();
        });
      });
    });
  }
});

var $table = $('#table');

$table.on('editable-save.bs.table', function() {
  'use strict';
  $('#btn-save').prop('disabled', false);
});

$table.on('check.bs.table check-all.bs.table check-some.bs.table', function() {
  'use strict';
  $('#btn-delete').prop('disabled', false);
});

$table.on('uncheck-all.bs.table', function() {
  'use strict';
  $('#btn-delete').prop('disabled', true);
});

$table.on('uncheck.bs.table	uncheck-some.bs.table', function() {
  'use strict';
  var selected = $table.bootstrapTable('getSelections');
  if (selected.length === 0) {
    $('#btn-delete').prop('disabled', true);
  }
});

