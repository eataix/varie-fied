import { isTrue, isFalse, isNull, getProjectProgressItemsUrl } from './defs';

let $table = null;

function exportFunctions() {
  'use strict';

  window.percentageFormatter = function(value) {
    return `${(value * 100).toFixed(2)}%`;
  };
}

export function initProgressTable(table) {
  'use strict';

  if ($table === null) {
    $table = $(table);
    exportFunctions();
  }

  $.ajax({
      url: getProjectProgressItemsUrl,
      type: 'GET',
      contentType: 'application/json; charset=utf-8'
    })
    .done(data => {
      $table.bootstrapTable({
        columns: [{
          checkbox: true
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
        }, {
          field: 'completed_value',
          title: 'Completed To Date',
          halign: 'center',
          editable: {
            type: 'text'
          },
          align: 'right',
          sortable: true
        }, {
          field: 'percentage',
          title: '%',
          halign: 'center',
          sortable: true,
          formatter: 'percentageFormatter',
          align: 'right',
          valign: 'center',
          width: '100px'
        }],
        data: data.progress_items,
        rowStyle: 'rowStyle',
        toolbar: '#toolbar'
      });
    });
}

export function handleSaveProgress() {
  'use strict';

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
  }, isConfirm => {
    if (!isConfirm) {
      swal({
        title: 'Cancelled',
        text: 'Your saves are unsaved',
        type: 'error'
      });
      return;
    }

    const data = $table.bootstrapTable('getData');
    const statusArray = new Array(data.length).fill(null);

    (function updateProgressItems(offset) {
      if (offset >= data.length) {
        return;
      }
      const value = data[offset];
      const id = value.id;
      const name = value.name;
      const contract_value = value.contract_value;
      const completed_value = value.completed_value;

      $.ajax({
          url: `/api/v1.0/progress_items/${id}`,
          type: 'PUT',
          data: JSON.stringify({
            name: name,
            contract_value: contract_value,
            completed_value: completed_value
          }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json'
        })
        .done(() => statusArray[offset] = true)
        .fail(() => statusArray[offset] = false);

      updateProgressItems(offset + 1);
    })(0);

    (function waiting() {
      if (statusArray.some(isFalse)) {
        swal({
          title: 'Error',
          text: 'Cannot save the changes... Please try again.',
          type: 'error'
        });
      } else if (statusArray.some(isNull)) {
        setTimeout(waiting, 100);
      } else if (statusArray.every(isTrue)) {
        swal({
          title: 'Nice!',
          text: 'You saved all changes.',
          type: 'success'
        }, () => location.reload());
      }
    })();
  });
}

export function handleDeleteProgress() {
  'use strict';

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
  }, isConfirmed => {
    if (!isConfirmed) {
      swal({
        title: 'Cancelled',
        text: 'Your project is safe :)',
        type: 'error'
      });
      return;
    }

    const selected = $table.bootstrapTable('getSelections');
    const statusArray = new Array(selected.length).fill(null);

    (function saveSelections(offset) {
      if (offset >= selected.length) {
        return;
      }
      $.ajax({
          url: `/api/v1.0/progress_items/${selected[offset].id}`,
          type: 'DELETE',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json'
        })
        .done(() => statusArray[offset] = true)
        .fail(() => {
          console.log(`Failed to delete progress item #${selected[offset].id}`);
          statusArray[offset] = false;
        });
      saveSelections(offset + 1);
    })(0);

    (function waiting() {
      if (statusArray.some(isFalse)) {
        swal({
          title: 'Error',
          text: 'Failed to delete some items.',
          type: 'error'
        });
      } else if (statusArray.some(isNull)) {
        setTimeout(waiting, 100);
      } else if (statusArray.every(isTrue)) {
        swal({
          title: 'Nice!',
          text: 'Deleted selected items',
          type: 'success'
        }, () => location.reload());
      }
    })();
  });
}

