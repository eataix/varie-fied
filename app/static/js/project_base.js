var metaData = $('#project-data').data();

//noinspection JSUnresolvedVariable
var projectId = metaData.projectId;
//noinspection JSUnresolvedVariable
var projectName = metaData.projectName;
//noinspection JSUnresolvedVariable
var projectActive = metaData.projectActive === 'True';
//noinspection JSUnresolvedVariable
var projectMargin = parseFloat(metaData.projectMargin);
//noinspection JSUnresolvedVariable
var projectAdminFee = $.isNumeric(metaData.projectAdminFee) ? parseFloat(metaData.projectAdminFee) : 0;

//noinspection JSUnresolvedVariable
var getProjectProgressItemsUrl = metaData.getProjectProgressItemsUrl;
//noinspection JSUnresolvedVariable
var getProjectVariationsUrl = metaData.getProjectVariationsUrl;

//noinspection JSUnresolvedVariable
var editProjectUrl = metaData.editProjectUrl;
//noinspection JSUnresolvedVariable
var deleteProjectUrl = metaData.deleteProjectUrl;

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
      var $button = $('.deleteConfirmation').find('.confirm');
      var html = $button.html();
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
    var action = projectActive ? 'archive' : 'unarchive';
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
      var $button = $('.archiveConfirmation').find('.confirm');
      var html = $button.html();
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

  $('#btn-add-new-progress-items').on('click', () => {
    var instance = $('#new-progress-items-form').parsley();
    instance.validate();
    if (!instance.isValid()) {
      return;
    }

    swal({
      title: 'Are you sure to add these?',
      text: 'You can edit them later!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'teal',
      confirmButtonText: 'Yes, add them!',
      cancelButtonText: 'No, cancel plx!',
      closeOnConfirm: false,
      closeOnCancel: false,
      customClass: 'deleteRowsConfirmation'
    }, isConfirmed => {
      if (!isConfirmed) {
        swal({
          title: 'Cancelled',
          text: 'They are not yet added :)',
          type: 'error'
        });
        return;
      }

      var $progressItems = $('.progressItem');

      var statusArray = new Array($progressItems.length).fill(null);

      (function createItem(offset) {
        if (offset >= $progressItems.length) {
          return;
        }
        var $o = $($progressItems[offset]);
        var name = $o.find('textarea').val();
        var contract_value = accounting.parse($o.find('input').val());

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
            })
            .done(() => {
              statusArray[offset] = true;
              createItem(offset + 1);
            })
            .fail(() => statusArray[offset] = false);
      })(0);

      (function waiting() {
        if (statusArray.some(isFalse)) {
          swal({
            title: 'Error',
            text: 'Failed to save some changes.',
            type: 'error'
          });
          console.log('error');
        } else if (statusArray.some(isNull)) {
          setTimeout(waiting, 100);
        } else if (statusArray.every(isTrue)) {
          swal({
            title: 'Nice!',
            text: 'You added all changes',
            type: 'success'
          }, () => location.reload());
        }
      })();
    });
  });

  $('#btn-save-meta').on('click', () => {
    var instance = $('#edit-project-meta-form').parsley();
    instance.validate();
    if (!instance.isValid()) {
      return;
    }

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
    }, isConfirmed => {
      if (!isConfirmed) {
        swal({
          title: 'Cancelled',
          text: 'Your project is safe :)',
          type: 'error'
        });
        return;
      }
      var $button = $('.saveMetaConfirmation').find('.confirm');
      var html = $button.html();
      $button.html('<i class="fa fa-spinner fa-spin"></i> ' + html);

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
          })
          .done(() =>
              swal({
                title: 'Nice!',
                text: 'Save changes',
                type: 'success'
              }, () => location.reload())
          );
    });
  });

  $.fn.editable.defaults.mode = 'inline';

  var $table = $('#table');

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
    var selected = $table.bootstrapTable('getSelections');
    if (selected.length === 0) {
      $('#btn-delete').prop('disabled', true);
    }
  });
})();
