var metaData = $('#meta-data').data();
var newProjectUrl = metaData.newProjectUrl;
var newVariationUrl = metaData.newVariationUrl;
var newItemUrl = metaData.newItemUrl;
var newClientUrl = metaData.newClientUrl;
var newProgressItemUrl = metaData.newProgressItemUrl;

function update() {
  'use strict';
  var total = 0.0;
  $('.input-amount').each((index, element) => {
    var val = $(element).val();
    if (val !== '' && $.isNumeric(val)) {
      total += parseFloat(val);
    }
  });
  $('#value-of-work').val(accounting.formatMoney(total));
  var subtotal = total * (1.0 + parseFloat($('#margin').val()) / 100.0);
  var adminFeeVal = $('#admin-fee').val();
  if (adminFeeVal !== '') {
    subtotal += accounting.parse(adminFeeVal);
  }
  $('#subtotal').val(accounting.formatMoney(subtotal));
}

function onSelectChanged() {
  'use strict';
  var project_id = $('#select_project_id')[0].selectize.items[0];
  $.ajax({
        url: `/api/v1.0/projects/${project_id}`,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
      })
      .done(data => {
        $('#margin').val(`${data.margin * 100}%`);
        var el = $('#admin-fee');
        if (data.admin_fee === null) {
          el.parents('.form-group').hide();
          el.val('');
        } else {
          el.parents('.form-group').show();
          el.val(accounting.formatMoney(data.admin_fee));
        }
        update();
      })
      .fail(() => {
        // TODO
      });
}

function addRow() {
  'use strict';
  $('#items').append($([
    '<tr class="variationItem">',
    '  <td>',
    '    <textarea name="description" class="input-desc form-control" required></textarea>',
    '  </td>',
    '  <td style="vertical-align:middle;">',
    '    <input type="text" name="amount" class="input-amount form-control" required data-parsley-type="number" oninput="update()"/>',
    '  </td>',
    '  <td style="width:150px;text-align:center;vertical-align:middle;">',
    '    <a href="javascript:void(0)" class="add-row" onclick="addRow();"><i class="fa fa-plus"></i> Add</a>',
    '    / ',
    '    <a href="javascript:void(0)" class="delete-row" onclick="deleteRow(this);"><i class="fa fa-minus"></i> Delete</a>',
    '  </td>',
    '</tr>'
  ].join('\n')));
  var $descriptionDiv = $('#descriptionDiv');
  $descriptionDiv.show();
  $descriptionDiv.val('');
  $descriptionDiv.attr('required', '');
}

function deleteRow(e) {
  'use strict';
  $(e).closest('tr').remove();
  update();
  if ($('.variationItem').length === 1) {
    var $descriptionDiv = $('#descriptionDiv');
    $descriptionDiv.hide();
    $descriptionDiv.find('textarea').removeAttr('required');
  }
}

function addClientRow() {
  'use strict';
  $('#clients').append($([
    '<tr class="client">',
    '  <td>',
    '    <textarea name="clientName" class="input-client-name form-control" required></textarea>',
    '  </td>',
    '  <td style="vertical-align: middle;">',
    '    <input type="text" name="firstAddressLine" class="input-first-address form-control" required/>',
    '  </td>',
    '  <td style="vertical-align: middle;">',
    '    <input type="text" name="secondAddressLine" class="input-second-address form-control" required/>',
    '  </td>',
    '  <td style="width:80px;text-align:center;vertical-align:middle;">',
    '    <a href="javascript:void(0)" class="add-row" onclick="addClientRow();"><i class="fa fa-plus"></i></a>',
    '    / ',
    '    <a href="javascript:void(0)" class="delete-row" onclick="deleteClientRow(this);"><i class="fa fa-minus"></i></a>',
    '  </td>',
    '</tr>'
  ].join('\n')));
}

function deleteClientRow(e) {
  'use strict';
  $(e).closest('tr').remove();
}

function isNull(element) {
  'use strict';
  return element === null;
}

function isTrue(element) {
  'use strict';
  return element === true;
}

function isFalse(element) {
  'use strict';
  return element === false;
}

(() => {
  'use strict';

  $(document).on('ready', () => {
    $.material.init();
    $('#picker_datetime').datetimepicker({
      showTodayButton: true
    });
    $('#select_project_id').selectize({
      sortField: 'text'
    });
  });

  $('#btn-add-project').on('click', () => {
    var instance = $('#form-new-project').parsley();
    instance.validate();
    if (!instance.isValid()) {
      return;
    }

    var project_name = $('#extra_project_name').val();
    var margin = $('#extra_margin').val();
    var reference_number = $('#extra_reference_number').val();
    var admin_fee = $('#extra_admin_fee').val();
    // in case admin_fee is unspecified
    if (admin_fee === '') {
      admin_fee = null;
    }

    swal({
      title: 'Are you sure to add a project?',
      text: 'You can delete this project later if necessary!',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, add it!',
      cancelButtonText: 'No, cancel plx!',
      closeOnConfirm: false,
      closeOnCancel: false,
      customClass: 'newProjectConfirmation'
    }, isConfirm => {
      if (!isConfirm) {
        swal('Cancelled', 'The project is not yet added :)', 'error');
        return;
      }

      var $button = $('.newProjectConfirmation').find('.confirm');
      var html = $button.html();
      $button.html('<i class="fa fa-spinner fa-spin"></i> ' + html);

      $.ajax({
            url: newProjectUrl,
            type: 'POST',
            data: JSON.stringify({
              name: project_name,
              margin: margin,
              reference_number: reference_number,
              admin_fee: admin_fee
            }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
          })
          .fail(() => {
            swal('Error', 'Cannot save the project... Please try again.', 'error');
          })
          .done(data => {
            var $clientElements = $('.client');
            var statusArray = new Array($clientElements.length).fill(null);

            (function createClient(offset) {
              if (offset >= $clientElements.length) {
                return;
              }
              var $elem = $($clientElements[offset]);
              var name = $elem.find('.input-client-name').val();
              var first_line_address = $elem.find('.input-first-address').val();
              if (first_line_address === '') {
                first_line_address = null;
              }
              var second_line_address = $elem.find('.input-second-address').val();
              if (second_line_address === '') {
                second_line_address = null;
              }
              $.ajax({
                    url: newClientUrl,
                    type: 'POST',
                    data: JSON.stringify({
                      name: name,
                      first_line_address: first_line_address,
                      second_line_address: second_line_address,
                      project_id: data.id
                    }),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json'
                  })
                  .done(() => {
                    statusArray[offset] = true;
                    createClient(offset + 1);
                  })
                  .fail(() => statusArray[offset] = false);
            })(0); // IIFE

            (function waiting() {
              if (statusArray.some(isFalse)) {
                swal('Error', 'Cannot save the project... Please try again.', 'error');
              } else if (statusArray.some(isNull)) {
                setTimeout(waiting, 100);
              } else if (statusArray.every(isTrue)) {
                swal({
                      title: 'Nice!',
                      text: `You created a new project: ${data.name}`,
                      type: 'success'
                    },
                    () => location.reload()
                );
              }
            })();
          });
    });
  });

  $('#btn_submit').on('click', () => {
    var instance = $('#form-new-variation').parsley();
    instance.validate();
    if (!instance.isValid()) {
      return;
    }

    var project_id = $('#select_project_id')[0].selectize.items[0];
    var time = $('#picker_datetime').data('DateTimePicker').date();
    var timeUTC = time.utc().format();
    var subcontractor = $('#input_subcontractor').val();
    var invoice_no = $('#input_invoice_no').val();
    var input_amount = accounting.unformat($('#subtotal').val());
    var input_description = '';
    var $variationItems = $('.variationItem');
    if ($variationItems.length === 1) {
      input_description = $variationItems.find('textarea').val();
    } else {
      input_description = $('#input_description').val();
    }

    swal({
      title: 'Are you sure to add a variation?',
      text: [
        `Time: ${time.format('Do MMMM YYYY h:mm:ss a')}`,
        `Subcontractor: ${subcontractor}`,
        `Subtotal: ${accounting.formatMoney(input_amount)}`
      ].join('\n'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, add it!',
      cancelButtonText: 'No, cancel plx!',
      closeOnConfirm: false,
      closeOnCancel: false,
      customClass: 'newVariationConfirmation'
    }, isConfirm => {
      if (!isConfirm) {
        swal('Cancelled', 'The variation is not yet added :)', 'error');
        return;
      }

      var $button = $('.newVariationConfirmation').find('.confirm');
      var html = $button.html();
      $button.html('<i class="fa fa-spinner fa-spin"></i> ' + html);

      $.ajax({
            url: newVariationUrl,
            type: 'POST',
            data: JSON.stringify({
              project_id: project_id,
              date: timeUTC,
              subcontractor: subcontractor,
              invoice_no: invoice_no,
              amount: input_amount,
              description: input_description
            }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
          })
          .fail(() => {
            swal('Error', 'Cannot save the variation... Please try again.', 'error');
          })
          .done(data => {
            var vid = data.vid;
            var $variationItems = $('.variationItem');

            var statusArray = new Array($variationItems.length).fill(null);

            (function createVariationItem(offset) {
              if (offset >= $variationItems.length) {
                return;
              }
              var $elem = $($variationItems[offset]);
              var desc = $elem.find('.input-desc').val();
              var amount = $elem.find('.input-amount').val();

              $.ajax({
                    url: newItemUrl,
                    type: 'POST',
                    data: JSON.stringify({
                      variation_id: vid,
                      description: desc,
                      amount: amount
                    }),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json'
                  })
                  .done(() => {
                    statusArray[offset] = true;
                    createVariationItem(offset + 1);
                  })
                  .fail(() => statusArray[offset] = false);
            })(0); // invoke

            (function waiting() {
              if (statusArray.some(isFalse)) {
                swal('Error', 'Cannot save the variation... Please try again.', 'error');
              } else if (statusArray.some(isNull)) {
                setTimeout(waiting, 100);
              } else if (statusArray.every(isTrue)) {
                swal({
                      title: 'Nice!',
                      text: 'You created a new variation',
                      type: 'success'
                    },
                    () => location.reload());
              }
            })(); // invoke
          });
    });
  });

  (function(i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function() {
          (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
  })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

  ga('create', 'UA-67200722-1', 'auto');
  ga('send', 'pageview');
})(); // invoke
