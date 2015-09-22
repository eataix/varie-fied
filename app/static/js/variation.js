var metaData = $('#project-data').data();
var deleteProjectUrl = metaData.deleteProjectUrl;
var editProjectUrl = metaData.editProjectUrl;
var getProjectVariationsUrl = metaData.getProjectVariationsUrl;
var projectActive = metaData.projectActive;
var projectAdminFee = metaData.projectAdminFee;
var projectId = metaData.projectId;
var projectMargin = metaData.projectMargin;
var projectName = metaData.projectName;

function pendingClick(cb) {
  'use strict';
  var $tr = $(cb).parents('tr');
  $tr.attr('class', 'info');
  $tr.find('.checkbox-approved').prop('checked', false);
  $tr.find('.checkbox-declined').prop('checked', false);
  $('#btn-save').prop('disabled', false);
}

function pendingFormatter(value, row, index) {
  'use strict';
  var mid;
  if (value) {
    mid = '<input class="checkbox checkbox-pending" type="checkbox" checked="" onclick="pendingClick(this);">';
  } else {
    mid = '<input class="checkbox checkbox-pending" type="checkbox" onclick="pendingClick(this);">';
  }
  return '<label>' + mid + '</label>';
}

function approvedClick(cb) {
  'use strict';
  var $tr = $(cb).parents('tr');
  $tr.attr('class', 'success');
  $tr.find('.checkbox-pending').prop('checked', false);
  $tr.find('.checkbox-declined').prop('checked', false);
  $('#btn-save').prop('disabled', false);
}

function approvedFormatter(value, row, index) {
  'use strict';
  var mid;
  if (value) {
    mid = '<input class="checkbox checkbox-approved" type="checkbox" checked="" onclick="approvedClick(this);">';
  } else {
    mid = '<input class="checkbox checkbox-approved" type="checkbox" onclick="approvedClick(this);">';
  }
  return '<label>' + mid + '</label>';
}

function declinedClick(cb) {
  'use strict';
  var $tr = $(cb).parents('tr');
  $tr.attr('class', 'danger');
  $tr.find('.checkbox-pending').prop('checked', false);
  $tr.find('.checkbox-approved').prop('checked', false);
  $('#btn-save').prop('disabled', false);
}

function declinedFormatter(value, row, index) {
  'use strict';
  var mid;
  if (value) {
    mid = '<input class="checkbox checkbox-declined" type="checkbox" checked="" onclick="declinedClick(this);">';
  } else {
    mid = '<input class="checkbox checkbox-declined" type="checkbox" onclick="declinedClick(this);">';
  }
  return '<label>' + mid + '</label>';
}

function completeClick() {
  'use strict';
  $('#btn-save').prop('disabled', false);
}

function completeFormatter(value, row, index) {
  'use strict';
  var mid;
  if (value) {
    mid = '<input class="checkbox checkbox-complete" type="checkbox" checked="" onclick="completeClick();">';
  } else {
    mid = '<input class="checkbox checkbox-complete" type="checkbox" onclick="completeClick();">';
  }
  return '<label>' + mid + '</label>';
}

function rowStyle(row, index) {
  'use strict';
  if (row.pending) {
    return {classes: 'info'};
  } else if (row.approved) {
    return {classes: 'success'};
  } else if (row.declined) {
    return {classes: 'danger'};
  } else {
    return {classes: 'active'};
  }
}

function timeFormatter(value, row, index) {
  'use strict';
  return '<p>' + moment(value).toDate() + '</p>';
}

function moneyFormatter(value, row, index) {
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
  var url = '/api/v1.0/variations/' + row.vid + '/items/';
  setTimeout(function() {
    $.ajax({
      url: url,
      type: 'GET',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json'
    }).done(function(data) {
      var items = data.items;
      var html = '<table class="table table-hover">' +
          '<thead>' +
          '<tr>' +
          '<th style="text-align: center">Name</th>' +
          '<th style="text-align: center">Amount</th>' +
          '</tr>' +
          '</thead>' +
          '<tbody>';
      var descriptionClass = 'new-editable-description-' + index;
      var amountClass = 'new-editable-amount-' + index;

      for (var i = 0; i < items.length; i += 1) {
        var item = items[i];
        var id = item.id;
        var description = '<a href="javascript:void(0)" data-type="textarea" pk=' + id + ' class="' + descriptionClass + '">' + item.description + '</a>';
        var amount = '<a href="javascript:void(0)" data-type="textarea" pk=' + id + ' class="' + amountClass + '">' + item.amount + '</a>';
        html += '<tr class="item-detail"><td>' + description + '</td><td style="text-align: right;width: 200px">' + amount + '</td></tr>';
      }
      html += '</tbody>' + '</table>';

      $($('[data-index=' + index + ']').next()).children().html(html);
      $('.' + descriptionClass).editable();
      $('.' + amountClass).editable();
      $('.' + descriptionClass).on('save', function(e, params) {
        $('#btn-save').prop('disabled', false);
      });
      $('.' + amountClass).on('save', function(e, params) {
        $('#btn-save').prop('disabled', false);
        var total = 0.0;
        $('.' + amountClass).each(function(i, o) {
          if (o !== e.target) {
            var val = $(o).html();
            if (val !== '' && isNumeric(val)) {
              total += parseFloat(val);
            }
          } else {
            total += parseFloat(params.newValue);
          }
        });
        total *= 1.0 + projectMargin;
        if (projectAdminFee !== 'None') {
          total += projectAdminFee;
        }
        $(e.target).closest('.detail-view').prev().children('.subtotal').html('<b>' + accounting.formatMoney(total) + '</b>');
      });
    });
  }, 0);

  return '<strong><i class="fa fa-spinner fa-spin"></i> Loading...</strong>';
}

$.ajax({
  url: getProjectVariationsUrl,
  type: 'GET',
  contentType: 'application/json; charset=utf-8',
  dataType: 'json'
}).done(function(data) {
  'use strict';
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
}).always(function() {
  'use strict';
  $('body').addClass('loaded');
});

$('#btn-delete').on('click', function() {
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
  }, function(isConfirmed) {
    if (!isConfirmed) {
      swal('Cancelled', 'Your project is safe :)', 'error');
      return;
    }
    var $button = $('.deleteRowsConfirmation').find('.confirm');
    var html = $button.html();
    $button.html('<i class="fa fa-spinner fa-spin"></i> ' + html);
    $button.off('click');

    var selected = $table.bootstrapTable('getSelections');
    var statusArray = new Array(selected.length);
    for (var i = 0; i < statusArray.length; i += 1) {
      statusArray[i] = null;
    }

    (function deleteVariation(offset) {
      if (offset >= selected.length) {
        return true;
      }
      $.ajax({
        url: '/api/v1.0/variations/' + selected[offset].vid,
        type: 'DELETE',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
      }).done(function() {
        statusArray[offset] = true;
        deleteVariation(offset + 1);
      }).fail(function() {
        statusArray[offset] = false;
      });
    })(0);

    (function waiting() {
      if (_.some(statusArray, function(status) {
            return status === false;
          })) {
        // TODO
      } else if (_.some(statusArray, function(status) {
            return status === null;
          })) {
        setTimeout(waiting, 100);
      } else if (_.every(statusArray, function(status) {
            return status === true;
          })) {

        swal({
          title: 'Nice!',
          text: 'Delete variations',
          type: 'success'
        }, function() {
          location.reload();
        });
      }
    })();
  });
});

$('#btn-save').on('click', function() {
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
  }, function(isConfirm) {
    if (!isConfirm) {
      swal('Cancelled', 'Your saves are unsaved', 'error');
      return;
    }

    var $button = $('.saveVariationsConfirmation').find('.confirm');
    var html = $button.html();
    $button.html('<i class="fa fa-spinner fa-spin"></i> ' + html);
    $button.off('click');

    var data = $table.bootstrapTable('getData');
    var statusArray = new Array(data.length);
    for (var j = 0; j < statusArray.length; j += 1) {
      statusArray[j] = null;
    }
    (function updateVariations(offset) {
      if (offset >= data.length) {
        return;
      }
      var value = data[offset];
      var vid = value.vid;
      var selector = '[data-index=' + offset + ']';
      var element = $(selector);
      value.pending = element.find('.pending').children().children().is(':checked');
      value.approved = element.find('.approved').children().children().is(':checked');
      value.declined = element.find('.declined').children().children().is(':checked');
      value.completed = element.find('.completed').children().children().is(':checked');
      value.amount = accounting.parse(element.find('.subtotal').html());

      $.ajax({
        url: '/api/v1.0/variations/' + vid,
        type: 'PUT',
        data: JSON.stringify(value),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
      }).done(function() {
        statusArray[offset] = true;
      }).fail(function() {
        statusArray[offset] = false;
      });
      updateVariations(offset + 1);
    })(0);

    var statusArray2 = new Array(data.length);
    for (var k = 0; k < statusArray2.length; k += 1) {
      statusArray2[k] = null;
    }
    $('.item-detail').each(function(i, o) {
      var itemData = $(o).find('a');
      var descriptionObj = $(itemData[0]);
      var amountObj = $(itemData[1]);
      var id = (descriptionObj.attr('pk'));
      var description = descriptionObj.html();
      var amount = parseFloat(amountObj.html());

      $.ajax({
        url: '/api/v1.0/items/' + id,
        type: 'PUT',
        data: JSON.stringify({
          amount: amount,
          description: description
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
      }).done(function() {
        statusArray2[i] = true;
      }).fail(function() {
        statusArray2[j] = false;
      });
    });

    (function waiting() {
      if (_.some(statusArray, function(status) {
            return status === false;
          }) ||
          _.some(statusArray2, function(status) {
            return status === false;
          })) {
        // TODO
      } else if (
          _.some(statusArray, function(status) {
            return status === null;
          }) ||
          _.some(statusArray2, function(status) {
            return status === null;
          })
      ) {
        setTimeout(waiting, 100);
      } else if (
          _.every(statusArray, function(status) {
            return status === true;
          }) &&
          _.every(statusArray2, function(status) {
            return status === true;
          })) {
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
