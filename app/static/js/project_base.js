var metaData = $('#project-data').data();
var newProgressItemUrl = metaData.newProgressItemUrl;

$.fn.editable.defaults.mode = 'inline';

$('#delete_project').on('click', function(e) {
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

      $('.progressItem').each(function(i, o) {
        var name = $(o).find('textarea').val();
        var contract_value = accounting.parse($(o).find('input').val());

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
        });
      });

      swal({
        title: 'Nice!',
        text: 'You saved all changes',
        type: 'success'
      }, function() {
        location.reload();
      });
    });
  }
});

var $table = $('#table');

$table.on('editable-save.bs.table', function() {
  $('#btn-save').prop('disabled', false);
});

$table.on('check.bs.table check-all.bs.table check-some.bs.table', function() {
  $('#btn-delete').prop('disabled', false);
});

$table.on('uncheck-all.bs.table', function() {
  $('#btn-delete').prop('disabled', true);
});

$table.on('uncheck.bs.table	uncheck-some.bs.table', function() {
  var selected = $table.bootstrapTable('getSelections');
  if (selected.length() === 0) {
    $('#btn-delete').prop('disabled', true);
  }
});


