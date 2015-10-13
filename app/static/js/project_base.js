const metaData = $('#project-data').data();

//noinspection JSUnresolvedVariable
const projectId = metaData.projectId;
//noinspection JSUnresolvedVariable
const projectName = metaData.projectName;
//noinspection JSUnresolvedVariable
const projectActive = metaData.projectActive === 'True';
//noinspection JSUnresolvedVariable
const projectMargin = parseFloat(metaData.projectMargin);
//noinspection JSUnresolvedVariable
const projectAdminFee = $.isNumeric(metaData.projectAdminFee) ? parseFloat(metaData.projectAdminFee) : 0;

//noinspection JSUnresolvedVariable
const getProjectProgressItemsUrl = metaData.getProjectProgressItemsUrl;
//noinspection JSUnresolvedVariable
const getProjectVariationsUrl = metaData.getProjectVariationsUrl;

//noinspection JSUnresolvedVariable
const editProjectUrl = metaData.editProjectUrl;
//noinspection JSUnresolvedVariable
const deleteProjectUrl = metaData.deleteProjectUrl;

(() => {
  'use strict';

  $('#delete_project').on('click', () => {
    swal({
      title: 'Are you sure to delete this project?',
      text: `You are going to delete project ${projectName}`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel plx!',
      closeOnConfirm: false,
      closeOnCancel: false,
      customClass: 'deleteConfirmation'
    }, isConfirm => {
      if (!isConfirm) {
        swal({
          title: 'Cancelled',
          text: 'Your project is safe :)',
          type: 'error'
        });
        return;
      }
      const $button = $('.deleteConfirmation').find('.confirm');
      const html = $button.html();
      $button.html('<i class="fa fa-spinner fa-spin"></i> ' + html);

      $.ajax({
          url: deleteProjectUrl,
          type: 'DELETE',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json'
        })
        .done(() => {
          swal({
            title: 'Nice!',
            text: `You delete: ${projectName}`,
            type: 'success'
          }, () => window.location.href = '/');
        });
    });
  });

  $('#archive_project').on('click', () => {
    const action = projectActive ? 'archive' : 'unarchive';
    swal({
      title: `Are you sure to ${action} the project?`,
      //text: 'You can recover this project later!',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: `Yes, ${action} it!`,
      cancelButtonText: 'No, cancel plx!',
      closeOnConfirm: false,
      closeOnCancel: false,
      customClass: 'archiveConfirmation'
    }, isConfirm => {
      if (!isConfirm) {
        swal({
          title: 'Cancelled',
          text: 'The project file is safe :)',
          type: 'error'
        });
        return;
      }
      const $button = $('.archiveConfirmation').find('.confirm');
      const html = $button.html();
      $button.html('<i class="fa fa-spinner fa-spin"></i> ' + html);
      $button.off('click');

      $.ajax({
          url: editProjectUrl,
          type: 'PUT',
          data: JSON.stringify({
            active: !projectActive
          }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json'
        })
        .done(() => {
          swal({
            title: 'Nice!',
            text: `You ${action}d projectName`,
            type: 'success'
          }, () => location.reload());
        });
    });
  });

  $.fn.editable.defaults.mode = 'inline';

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
