function pendingClick(cb) {
  'use strict';
  const $tr = $(cb).parents('tr');
  $tr.attr('class', 'info');
  $tr.find('.checkbox-approved').prop('checked', false);
  $tr.find('.checkbox-declined').prop('checked', false);
  $('#btn-save').prop('disabled', false);
}

function pendingFormatter(value) {
  'use strict';
  const mid = value ? 'checked=""' : '';
  return [
    '<label>',
    `  <input class="checkbox checkbox-pending" type="checkbox" ${mid} onclick="pendingClick(this);">`,
    '</label>'
  ].join('\n');
}

function approvedClick(cb) {
  'use strict';
  const $tr = $(cb).parents('tr');
  $tr.attr('class', 'success');
  $tr.find('.checkbox-pending').prop('checked', false);
  $tr.find('.checkbox-declined').prop('checked', false);
  $('#btn-save').prop('disabled', false);
}

function approvedFormatter(value) {
  'use strict';
  const mid = value ? 'checked=""' : '';
  return [
    '<label>',
    `<input class="checkbox checkbox-approved" type="checkbox" ${mid} onclick="approvedClick(this);">`,
    '</label>'
  ].join('\n');
}

function declinedClick(cb) {
  'use strict';
  const $tr = $(cb).parents('tr');
  $tr.attr('class', 'danger');
  $tr.find('.checkbox-pending').prop('checked', false);
  $tr.find('.checkbox-approved').prop('checked', false);
  $('#btn-save').prop('disabled', false);
}

function declinedFormatter(value) {
  'use strict';
  const mid = value ? 'checked=""' : '';
  return [
    '<label>',
    `  <input class="checkbox checkbox-declined" type="checkbox" ${mid} onclick="declinedClick(this);">`,
    '</label>'
  ].join('\n');
}

function completeClick() {
  'use strict';
  $('#btn-save').prop('disabled', false);
}

function completeFormatter(value) {
  'use strict';
  const mid = value ? 'checked=""' : '';
  return [
    '<label>',
    `<input class="checkbox checkbox-complete" type="checkbox" ${mid} onclick="completeClick();">`,
    '</label>'
  ].join('\n');
}

function rowStyle(row) {
  'use strict';
  if (row.pending) {
    return {
      classes: 'info'
    };
  } else if (row.approved) {
    return {
      classes: 'success'
    };
  } else if (row.declined) {
    return {
      classes: 'danger'
    };
  } else {
    return {
      classes: 'active'
    };
  }
}

function timeFormatter(value) {
  'use strict';
  return `<p>${moment(value).toDate()}</p>`;
}

function moneyFormatter(value) {
  'use strict';
  return accounting.formatMoney(value);
}

function validate_required(v) {
  'use strict';
  if (v === null || v === '') {
    return 'Cannot be empty!';
  }
}

function detailFormatter(index, row) {
  'use strict';

  $.ajax({
        url: `/api/v1.0/variations/${row.vid}\/items/`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
      })
      .done(data => {
        const items = data.items;
        let html = [
          '<table class="table table-hover">',
          '  <thead>',
          '    <tr>',
          '      <th style="text-align: center">Name</th>',
          '      <th style="text-align: center">Amount</th>',
          '    </tr>',
          '  </thead>',
          '  <tbody>'
        ].join('\n');
        const descriptionClass = `new-editable-description-${index}`;
        const amountClass = `new-editable-amount-${index}`;

        items.forEach(item =>
            html += [
              '    <tr class="item-detail">',
              '      <td>',
              `        <a href="javascript:void(0)" data-type="textarea" pk=${item.id} class="${descriptionClass}">${item.description}</a>`,
              '      </td>',
              '      <td style="text-align: right;width: 200px">',
              `        <a href="javascript:void(0)" data-type="textarea" pk=${item.id} class="${amountClass}">${item.amount}</a>`,
              '      </td>',
              '    </tr>'
            ].join('\n'));

        html += [
          '  </tbody>',
          '</table>'
        ].join('\n');

        $($(`[data-index=${index}]`).next()).children().html(html);

        const $description = $(`.${descriptionClass}`);
        $description.editable();
        $description.on('save', () => $('#btn-save').prop('disabled', false));

        const $amount = $(`.${amountClass}`);
        $amount.editable();
        $amount.on('save', (e, params) => {
          $('#btn-save').prop('disabled', false);
          let total = 0.0;
          $(`.${amountClass}`).each((i, o) => {
            if (o !== e.target) {
              const val = $(o).html();
              if (val !== '' && $.isNumeric(val)) {
                total += parseFloat(val);
              }
            } else {
              total += parseFloat(params.newValue);
            }
          });
          total *= 1.0 + projectMargin;
          total += projectAdminFee;
          $(e.target).closest('.detail-view').prev().children('.subtotal').html(`<b>${accounting.formatMoney(total)}</b>`);
        });
      });

  return '<strong><i class="fa fa-spinner fa-spin"></i> Loading...</strong>';
}

(() => {
  'use strict';

  $.ajax({
        url: getProjectVariationsUrl,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
      })
      .done(data => {
        $('#table').bootstrapTable({
          columns: [{
            checkbox: true
          }, {
            field: 'virtual_id',
            title: '#',
            halign: 'center',
            sortable: true
          }, {
            field: 'description',
            title: 'Description',
            editable: {
              type: 'textarea'
            },
            halign: 'center',
            width: '600px'
          }, {
            field: 'date',
            title: 'Date',
            formatter: 'timeFormatter',
            halign: 'center',
            width: '300px'
          }, {
            field: 'subcontractor',
            title: 'Subcontractor',
            editable: {
              type: 'text',
              validate: validate_required
            },
            halign: 'center',
            sortable: true
          }, {
            field: 'amount',
            title: 'Subtotal ($)',
            halign: 'center',
            sortable: true,
            formatter: 'moneyFormatter',
            'class': 'subtotal'
          }, {
            field: 'invoice_no',
            title: 'Invoice #',
            editable: true,
            halign: 'center'
          }, {
            field: 'note',
            title: 'Note',
            editable: {
              type: 'textarea'
            },
            halign: 'center'
          }, {
            field: 'pending',
            title: 'Pending',
            formatter: 'pendingFormatter',
            halign: 'center',
            valign: 'center',
            sortable: true,
            'class': 'pending'
          }, {
            field: 'approved',
            title: 'Approved',
            formatter: 'approvedFormatter',
            halign: 'center',
            valign: 'center',
            sortable: true,
            'class': 'approved'
          }, {
            field: 'declined',
            title: 'Declined',
            formatter: 'declinedFormatter',
            halign: 'center',
            valign: 'center',
            sortable: true,
            'class': 'declined'
          }, {
            field: 'completed',
            title: 'Completed',
            formatter: 'completeFormatter',
            halign: 'center',
            valign: 'center',
            sortable: true,
            'class': 'completed'
          }],
          data: data.variations,
          rowStyle: 'rowStyle',
          toolbar: '#toolbar',
          detailView: true,
          detailFormatter: 'detailFormatter'
        });
      })
      .always(() => $('body').addClass('loaded'));

  const $table = $('#table');

  $('#btn-save').on('click', () => {
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
          text: 'Your changes are unsaved',
          type: 'error'
        });
        return;
      }

      const $button = $('.saveVariationsConfirmation').find('.confirm');
      const html = $button.html();
      $button.html('<i class="fa fa-spinner fa-spin"></i> ' + html);

      const data = $table.bootstrapTable('getData');
      const statusArray = new Array(data.length).fill(null);

      (function updateVariations(offset) {
        if (offset >= data.length) {
          return;
        }
        const value = data[offset];
        const vid = value.vid;
        const selector = `[data-index=${offset}]`;
        const element = $(selector);
        value.pending = element.find('.pending').children().children().is(':checked');
        value.approved = element.find('.approved').children().children().is(':checked');
        value.declined = element.find('.declined').children().children().is(':checked');
        value.completed = element.find('.completed').children().children().is(':checked');
        value.amount = accounting.parse(element.find('.subtotal').html());

        $.ajax({
              url: `/api/v1.0/variations/${vid}`,
              type: 'PUT',
              data: JSON.stringify(value),
              contentType: 'application/json; charset=utf-8',
              dataType: 'json'
            })
            .done(() => statusArray[offset] = true)
            .fail(() => statusArray[offset] = false);

        updateVariations(offset + 1);
      })(0);

      const $itemDetails = $('.item-detail');
      const statusArray2 = new Array($itemDetails.length).fill(null);

      (function updateItemDetail(offset) {
        if (offset >= $itemDetails.length) {
          return;
        }
        const itemData = $($itemDetails[offset]).find('a');
        const descriptionObj = $(itemData[0]);
        const amountObj = $(itemData[1]);
        const id = (descriptionObj.attr('pk'));
        const description = descriptionObj.html();
        const amount = parseFloat(amountObj.html());

        $.ajax({
              url: `/api/v1.0/items/${id}`,
              type: 'PUT',
              data: JSON.stringify({
                amount: amount,
                description: description
              }),
              contentType: 'application/json; charset=utf-8',
              dataType: 'json'
            })
            .done(() => statusArray2[offset] = true)
            .fail(() => statusArray2[offset] = false);

        updateItemDetail(offset + 1);
      })(0);

      (function waiting() {
        if (statusArray.some(isFalse) || statusArray2.some(isFalse)) {
          swal({
            title: 'Error',
            text: 'Failed to save some changes.',
            type: 'error'
          });
        } else if (statusArray.some(isNull) || statusArray2.some(isNull)) {
          setTimeout(waiting, 100);
        } else if (statusArray.every(isTrue) && statusArray2.every(isTrue)) {
          swal({
            title: 'Nice!',
            text: 'You saved all changes.',
            type: 'success'
          }, () => location.reload());
        }
      })();
    });
  });

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
    }, isConfirmed => {
      if (!isConfirmed) {
        swal({
          title: 'Cancelled',
          text: 'Your project is safe :)',
          type: 'error'
        });
        return;
      }
      const $button = $('.deleteRowsConfirmation').find('.confirm');
      const html = $button.html();
      $button.html('<i class="fa fa-spinner fa-spin"></i> ' + html);
      $button.off('click');

      const selected = $table.bootstrapTable('getSelections');
      const statusArray = new Array(selected.length).fill(null);

      (function deleteVariation(offset) {
        if (offset >= selected.length) {
          return;
        }
        $.ajax({
              url: `/api/v1.0/variations/${selected[offset].vid}`,
              type: 'DELETE',
              contentType: 'application/json; charset=utf-8',
              dataType: 'json'
            })
            .done(() => statusArray[offset] = true)
            .fail(() => statusArray[offset] = false);
        deleteVariation(offset + 1);
      })(0);

      (function waiting() {
        if (statusArray.some(isFalse)) {
          swal({
            title: 'Error',
            text: 'Failed to delete some variations',
            type: 'error'
          });
        } else if (statusArray.some(isNull)) {
          setTimeout(waiting, 100);
        } else if (statusArray.every(isTrue)) {
          swal({
            title: 'Done!',
            text: 'Deleted variations',
            type: 'success'
          }, () => location.reload());
        }
      })();
    });
  });
})();
