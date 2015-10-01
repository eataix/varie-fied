function addProgressItemRow() {
  'use strict';
  var newRow = $('<tr class="progressItem">' +
      '<td>' +
      '<textarea name="name" class="input-progress-item-name form-control" required></textarea>' +
      '</td>' +
      '<td style="vertical-align: middle;">' +
      '<input type="text" name="amount" class="input-progress-item-value form-control" required data-parsley-type="number"/>' +
      '</td>' +
      '<td style="width:150px;text-align:center;vertical-align:middle">' +
      '<a href="javascript:void(0)" class="add-progress-item-row" onclick="addProgressItemRow();"><i class="fa fa-plus"></i>' +
      ' Add</a>' +
      ' / ' +
      '<a href="javascript:void(0)" class="delete-progress-item-row" onclick="deleteProgressItemRow(this);"><i class="fa fa-minus"></i>' +
      ' Delete</a>' +
      '</td>' +
      '</tr>');
  $('#progressItems').append(newRow);
}

function deleteProgressItemRow(e) {
  'use strict';
  $(e).closest('tr').remove();
}

function onClickUp(e) {
  'use strict';
  var $thisRow = $(e).closest('tr');
  var $prevRow = $thisRow.prev();
  if ($prevRow.length !== 0) {
    $thisRow.after($prevRow);
  }
  $('#btn-save').prop('disabled', false);
}

function onClickDown(e) {
  'use strict';
  var $thisRow = $(e).closest('tr');
  var $nextRow = $thisRow.next();
  if ($nextRow.length !== 0) {
    $thisRow.before($nextRow);
  }
  $('#btn-save').prop('disabled', false);
}

function reorderFormatter(value, row, index) {
  'use strict';
  return '<div style="text-align: middle">' +
      '<a href="javascript:void(0)" onclick="onClickUp(this);"><i class="fa fa-caret-up"></i> </a>' +
      '<a href="javascript:void(0)" onclick="onClickDown(this);"><i class="fa fa-caret-down"></i> </a>' +
      '</div>';
}

function paddingFormatterA(value, row, index) {
  'use strict';
  return value.toFixed(2);
}

function paddingFormatterB(value, row, index) {
  'use strict';
  return value.toFixed(2);
}

function percentageFormatter(value, row, index) {
  'use strict';
  return (value * 100).toFixed(2) + '%';
}

(function() {
  'use strict';

  var $table = $('#table');

  $('#btn-delete').on('click', function() {
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

      var selected = $table.bootstrapTable('getSelections');
      var statusArray = new Array(selected.length);
      _.fill(statusArray, null);

      (function saveSelections(offset) {
        if (offset >= selected.length) {
          return true;
        }
        $.ajax({
          url: '/api/v1.0/progress_items/' + selected[offset].id,
          type: 'DELETE',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json'
        }).done(function() {
          statusArray[offset] = true;
        }).fail(function() {
          statusArray[offset] = false;
        });
        saveSelections(offset + 1);
      })(0);

      (function waiting() {
        if (statusArray.some(isFalse)) {
          // TODO
        } else if (statusArray.some(isNull)) {
          setTimeout(waiting, 100);
        } else if (statusArray.every(isTrue)) {
          swal({
            title: 'Nice!',
            text: 'Deleted selected items',
            type: 'success'
          }, function() {
            location.reload();
          });
        }
      })();
    });
  });

  $('#btn-save').on('click', function() {
    swal({
      title: 'Are you sure to save all the changes?',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: 'teal',
      confirmButtonText: 'Yes, save them!',
      cancelButtonText: 'No, cancel plx!',
      closeOnConfirm: false,
      closeOnCancel: false,
      customClass: 'saveVariationsConfirmation'
    }, function(isConfirm) {
      if (!isConfirm) {
        swal('Cancelled', 'Your saves are unsaved', 'error');
        return;
      }

      var data = $table.bootstrapTable('getData');
      var statusArray = new Array(data.length);
      for (var i = 0; i < statusArray.length; i += 1) {
        statusArray[i] = null;
      }
      (function updateProgressItems(offset) {
        if (offset >= data.length) {
          return;
        }
        var value = data[offset];
        var id = value.id;
        var name = value.name;
        var contract_value = value.contract_value;
        var completed_value = value.completed_value;

        $.ajax({
          url: '/api/v1.0/progress_items/' + id,
          type: 'PUT',
          data: JSON.stringify({
            name: name,
            contract_value: contract_value,
            completed_value: completed_value
          }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json'
        }).done(function() {
          statusArray[offset] = true;
        }).fail(function() {
          statusArray[offset] = false;
        });

        updateProgressItems(offset + 1);
      })(0);

      (function waiting() {
        if (statusArray.some(isFalse)) {
          // TODO
        } else if (statusArray.some(isNull)) {
          setTimeout(waiting, 100);
        } else if (statusArray.every(isTrue)) {
          swal({
            title: 'Nice!',
            text: 'You saved all changes.',
            type: 'success'
          }, function() {
            location.reload();
          });
        }
      })();
    });
  });

  $.ajax({
    url: getProjectProgressItemsUrl,
    type: 'GET',
    contentType: 'application/json; charset=utf-8'
  }).done(function(data) {
    $('#table').bootstrapTable({
      columns: [{
        checkbox: true
        //}, {
        //    field: 'virtual_id',
        //    title: '#',
        //    halign: 'center',
        //    valign: 'center',
        //    sortable: true
      }, {
        field: 'name',
        title: 'Name',
        halign: 'center',
        editable: {
          type: 'text'
        },
        sortable: true
      }, {
        field: 'contract_value',
        title: 'Contract Value',
        halign: 'center',
        editable: {
          type: 'text'
        },
        align: 'right',
        sortable: true
        //formatter: 'paddingFormatterA'
      }, {
        field: 'completed_value',
        title: 'Completed To Date',
        halign: 'center',
        editable: {
          type: 'text'
        },
        align: 'right',
        sortable: true
        //formatter: 'paddingFormatterB'
      }, {
        field: 'percentage',
        title: '%',
        halign: 'center',
        sortable: true,
        formatter: 'percentageFormatter',
        align: 'right',
        valign: 'center',
        width: '100px'
        //}, {
        //  title: 'Action',
        //  align: 'center',
        //  formatter: 'reorderFormatter',
        //  width: '100px'
      }],
      data: data.progress_items,
      rowStyle: 'rowStyle',
      toolbar: '#toolbar'
    });
  });
})();
