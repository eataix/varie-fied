import { isTrue, isFalse, isNull, getProjectVariationsUrl, projectMargin, projectAdminFee } from './defs';
import { spinInterval } from './config';

let $table = null;

const setCallback = () => {
  window.onbeforeunload = () => {
    return 'You have unsaved changes.';
  };
};

const removeCallback = () => {
  window.onbeforeunload = null;
};

const exportFunctions = () => {
  window.pendingClick = (cb) => {
    $(cb).attr('disabled', true);
    setCallback();
    const $tr = $(cb).parents('tr');
    $tr.attr('class', 'warning');
    const $approved = $tr.find('.checkbox-approved');
    $approved.prop('checked', false);
    $approved.attr('disabled', false);
    const $declined = $tr.find('.checkbox-declined');
    $declined.prop('checked', false);
    $declined.attr('disabled', false);
  };

  window.pendingFormatter = (value) => {
    const mid = value ? 'checked="" disabled' : '';
    return [
      '<div class="checkbox checkbox-info">',
      '  <label>',
      `    <input class="checkbox checkbox-pending" type="checkbox" ${mid} onclick="pendingClick(this);">`,
      '  </label>',
      '</div>'
    ].join('\n');
  };

  window.approvedClick = (cb) => {
    $(cb).attr('disabled', true);
    setCallback();
    const $tr = $(cb).parents('tr');
    $tr.attr('class', 'success');
    const $pending = $tr.find('.checkbox-pending');
    $pending.prop('checked', false);
    $pending.attr('disabled', false);
    const $declined = $tr.find('.checkbox-declined');
    $declined.prop('checked', false);
    $declined.attr('disabled', false);
  };

  window.approvedFormatter = (value) => {
    const mid = value ? 'checked="" disabled' : '';
    return [
      '<div class="checkbox checkbox-success">',
      '  <label>',
      `    <input class="checkbox checkbox-approved" type="checkbox" ${mid} onclick="approvedClick(this);">`,
      '  </label>',
      '</div>'
    ].join('\n');
  };

  window.declinedClick = (cb) => {
    $(cb).attr('disabled', true);
    setCallback();
    const $tr = $(cb).parents('tr');
    $tr.attr('class', 'danger');
    const $pending = $tr.find('.checkbox-pending');
    $pending.prop('checked', false);
    $pending.attr('disabled', false);
    const $approved = $tr.find('.checkbox-approved');
    $approved.prop('checked', false);
    $approved.attr('disabled', false);
  };

  window.declinedFormatter = (value) => {
    const mid = value ? 'checked="" disabled' : '';
    return [
      '<div class="checkbox checkbox-danger">',
      '  <label>',
      `    <input class="checkbox checkbox-declined" type="checkbox" ${mid} onclick="declinedClick(this);">`,
      '  </label>',
      '</div>'
    ].join('\n');
  };

  window.completeClick = () => {
    setCallback();
  };

  window.completeFormatter = (value) => {
    const mid = value ? 'checked=""' : '';
    return [
      '<div class="checkbox checkbox-primary">',
      '  <label>',
      `    <input class="checkbox checkbox-complete" type="checkbox" ${mid} onclick="completeClick();">`,
      '  </label>',
      '</div>'
    ].join('\n');
  };

  window.rowStyle = (row) => {
    if (row.pending) {
      return {
        classes: 'warning'
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
  };

  window.timeFormatter = (value) => {
    return `<p>${moment(value).toDate()}</p>`;
  };

  window.moneyFormatter = (value) => {
    return `<p>${accounting.formatMoney(value)}</p>`;
  };

  window.detailFormatter = (index, row) => {
    $.ajax({
      url: `/api/v1.0/variations/${row.vid}/items/`,
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json'
    }).done((data) => {
      const items = data.items;
      let html = [
        '<table class="table table-hover">',
        '  <thead>',
        '    <tr>',
        '      <th>Name</th>',
        '      <th>Amount</th>',
        '    </tr>',
        '  </thead>',
        '  <tbody>'
      ].join('\n');
      const descriptionClass = `new-editable-description-${index}`;
      const amountClass = `new-editable-amount-${index}`;

      items.forEach((item) => html += [
        '    <tr class="item-detail">',
        '      <td>',
        `        <a href="javascript:void(0)" data-type="textarea" pk=${item.id} class="${descriptionClass}">${item.description}</a>`,
        '      </td>',
        '      <td style="text-align: right;width: 200px">',
        `        <a href="javascript:void(0)" data-type="text" pk=${item.id} class="${amountClass}">${item.amount}</a>`,
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

      const $amount = $(`.${amountClass}`);
      $amount.editable();
      $amount.on('save', (e, params) => {
        let total = 0.0;
        $(`.${amountClass}`).each((i, o) => {
          if (o === e.target) {
            total += parseFloat(params.newValue);
          } else {
            const val = $(o).html();
            if (val !== '' && $.isNumeric(val)) {
              total += parseFloat(val);
            }
          }
        });
        total *= 1.0 + projectMargin;
        total += projectAdminFee;
        $(e.target).closest('.detail-view').prev().children('.subtotal').html(`<b>${accounting.formatMoney(total)}</b>`);
      });
    });

    return '<strong><span class="fa fa-spinner fa-spin"></span> Loading...</strong>';
  };
};

//noinspection JSUnusedLocalSymbols
export const initVariationTable = (table) => {
  if (_.isNull($table)) {
    $table = $(table);
    exportFunctions();
  }

  $.ajax({
    url: getProjectVariationsUrl,
    type: 'GET',
    contentType: 'application/json; charset=utf-8'
  }).done((data) => {
    $table.bootstrapTable({
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
          validate: (v) => {
            if (_.isNull(v) || v === '') {
              return 'Cannot be empty!';
            }
          }
        },
        halign: 'center',
        sortable: true
      }, {
        field: 'amount',
        title: 'Subtotal ($)',
        halign: 'center',
        sortable: true,
        formatter: 'moneyFormatter',
        class: 'subtotal'
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
        class: 'pending'
      }, {
        field: 'approved',
        title: 'Approved',
        formatter: 'approvedFormatter',
        halign: 'center',
        valign: 'center',
        sortable: true,
        class: 'approved'
      }, {
        field: 'declined',
        title: 'Declined',
        formatter: 'declinedFormatter',
        halign: 'center',
        valign: 'center',
        sortable: true,
        class: 'declined'
      }, {
        field: 'completed',
        title: 'Completed',
        formatter: 'completeFormatter',
        halign: 'center',
        valign: 'center',
        sortable: true,
        class: 'completed'
      }],
      data: data.variations,
      rowStyle: 'rowStyle',
      toolbar: '#toolbar',
      detailView: true,
      detailFormatter: 'detailFormatter'
    });
  }).always(() => {
    $('body').addClass('loaded');
  });

  $table.on('editable-save.bs.table', () => {
    setCallback();
  });
};

export const handleSaveVariation = () => {
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
  }, (isConfirm) => {
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
    $button.html(`<span class="fa fa-spinner fa-spin"></span> ${html}`);

    const data = $table.bootstrapTable('getData');
    const statusArray = new Array(data.length).fill(null);

    (() => {
      const updateVariations = (offset = 0) => {
        if (offset >= data.length) {
          return;
        }
        const value = data[offset];
        const vid = value.vid;
        const selector = `[data-index=${offset}]`;
        const element = $(selector);
        value.pending = element.find('.checkbox-pending').is(':checked');
        value.approved = element.find('.checkbox-approved').is(':checked');
        value.declined = element.find('.checkbox-declined').is(':checked');
        value.completed = element.find('.checkbox-complete').is(':checked');
        value.amount = accounting.parse(element.find('.subtotal').html());

        $.ajax({
          url: `/api/v1.0/variations/${vid}`,
          type: 'PUT',
          data: JSON.stringify(value),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json'
        }).done(() => {
          statusArray[offset] = true;
        }).fail(() => {
          statusArray[offset] = false;
        });

        updateVariations(offset + 1);
      };
      updateVariations(0);
    })();

    const $itemDetails = $('.item-detail');
    const statusArray2 = new Array($itemDetails.length).fill(null);

    (() => {
      const updateItemDetail = (offset = 0) => {
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
            amount,
            description
          }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json'
        }).done(() => {
          statusArray2[offset] = true;
        }).fail(() => {
          statusArray2[offset] = false;
        });

        updateItemDetail(offset + 1);
      };
      updateItemDetail(0);
    })();

    (() => {
      const waiting = () => {
        if (statusArray.some(isFalse) || statusArray2.some(isFalse)) {
          swal({
            title: 'Error',
            text: 'Failed to save some changes.',
            type: 'error'
          });
        } else if (statusArray.some(isNull) || statusArray2.some(isNull)) {
          setTimeout(waiting, spinInterval);
        } else if (statusArray.every(isTrue) && statusArray2.every(isTrue)) {
          swal({
            title: 'Nice!',
            text: 'You saved all changes.',
            type: 'success'
          }, () => {
            removeCallback();
            location.reload();
          });
        }
      };
      waiting();
    })();
  });
};

export const handleDeleteVariation = () => {
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
  }, (isConfirmed) => {
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
    $button.html(`<span class="fa fa-spinner fa-spin"></span> ${html}`);
    $button.off('click');

    const selected = $table.bootstrapTable('getSelections');
    const statusArray = new Array(selected.length).fill(null);

    (() => {
      const deleteVariation = (offset = 0) => {
        if (offset >= selected.length) {
          return;
        }
        $.ajax({
          url: `/api/v1.0/variations/${selected[offset].vid}`,
          type: 'DELETE',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json'
        }).done(() => {
          statusArray[offset] = true;
        }).fail(() => {
          statusArray[offset] = false;
        });
        deleteVariation(offset + 1);
      };
      deleteVariation(0);
    })();

    (() => {
      const waiting = () => {
        if (statusArray.some(isFalse)) {
          swal({
            title: 'Error',
            text: 'Failed to delete some variations',
            type: 'error'
          });
        } else if (statusArray.some(isNull)) {
          setTimeout(waiting, spinInterval);
        } else if (statusArray.every(isTrue)) {
          swal({
            title: 'Done!',
            text: 'Deleted variations',
            type: 'success'
          }, () => {
            location.reload();
          });
        }
      };
      waiting();
    })();
  });
};

