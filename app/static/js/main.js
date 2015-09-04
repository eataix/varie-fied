var metaData = $('#meta-data').data();
var newProjectUrl = metaData['newProjectUrl'];
var newVariationUrl = metaData['newVariationUrl'];
var newItemUrl = metaData['newItemUrl'];

function onSelectChanged(e) {
    var project_id = $('#select_project_id')[0].selectize.items[0];
    $.ajax({
        url: '/api/v1.0/projects/' + project_id,
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
    }).done(function (data) {
        $('#margin').val(data['margin'] * 100 + '%');
        var el = $('#admin-fee');
        if (data['admin_fee'] === null) {
            el.parents('.form-group').hide();
            el.val('');
        } else {
            el.parents('.form-group').show();
            el.val(accounting.formatMoney(data['admin_fee']));
        }
        update();
    });
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function update() {
    var total = 0.0;
    $('.input-amount').each(function (i, o) {
        var val = $(o).val();
        if (val !== "" && isNumeric(val)) {
            total += parseFloat(val);
        }
    });
    $('#value-of-work').val(accounting.formatMoney(total));
    var subtotal = 0.0;
    subtotal += total * (1.0 + parseFloat($('#margin').val()) / 100.0);
    var adminFeeVal = $('#admin-fee').val();
    if (adminFeeVal !== '') {
        subtotal += accounting.parse(adminFeeVal);
    }
    $('#subtotal').val(accounting.formatMoney(subtotal));
}

function addRow(s) {
    var newRow = $('<tr class="variationItem">' +
        '<td>' +
        '<textarea name="description" class="input-desc form-control" required></textarea>' +
        '</td>' +
        '<td style="vertical-align:middle;">' +
        '<input type="text" name="amount" class="input-amount form-control" required data-parsley-type="number" oninput="update()"/>' +
        '</td>' +
        '<td style="width:150px;text-align:center;vertical-align:middle;">' +
        '<a href="javascript:void(0)" class="add-row" onclick="addRow();"><i class="fa fa-plus"></i> Add</a>' +
        ' / ' +
        '<a href="javascript:void(0)" class="delete-row" onclick="deleteRow(this);"><i class="fa fa-minus"></i> Delete</a>' +
        '</td>' +
        '</tr>');
    $('#items').append(newRow);
}

function deleteRow(e) {
    var row = e.parentNode.parentNode;
    row.parentNode.removeChild(row);
    update();
}

$(function () {
    $.material.init();
    $('#picker_datetime').datetimepicker({showTodayButton: true});
    $('#form-new-project').parsley();
    $('#form-new-variation').parsley();
});

$(document).ready(function () {
    $('#select_project_id').selectize({
        sortField: 'text'
    });

    $('#btn-add-project').on('click', function (e) {
        var instance = $('#form-new-project').parsley();
        instance.validate();
        if (instance.isValid()) {
            var project_name = $('#extra_project_name').val();
            var margin = $('#extra_margin').val();
            var reference_number = $('#extra_reference_number').val();
            var admin_fee = $('#extra_admin_fee').val();
            if (admin_fee === '') {
                admin_fee = null;
            }

            swal({
                title: 'Are you sure to add the project?',
                text: 'You can recover this project later!',
                type: 'info',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Yes, add it!',
                cancelButtonText: 'No, cancel plx!',
                closeOnConfirm: false,
                closeOnCancel: false,
                customClass: 'newProjectConfirmation'
            }, function (isConfirm) {
                if (!isConfirm) {
                    swal('Cancelled', 'The project file is safe :)', 'error');
                    return;
                }

                var $button = $('.newProjectConfirmation').find('.confirm');
                var html = $button.html();
                $button.html('<i class="fa fa-spinner fa-spin"></i> ' + html);
                $button.off('click');

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
                }).done(function (data) {
                    swal({
                        title: 'Nice!',
                        text: 'You created a new project: ' + data['name'],
                        type: 'success'
                    }, function () {
                        location.reload()
                    });
                });
            });
        }
    });

    $('#btn_submit').on('click', function (e) {
        var instance = $('#form-new-variation').parsley();
        instance.validate();
        if (instance.isValid()) {
            var project_id = $('#select_project_id')[0].selectize.items[0];
            var time = $('#picker_datetime').data("DateTimePicker").date();
            var timeUTC = time.utc().format();
            var subcontractor = $('#input_subcontractor').val();
            var invoice_no = $('#input_invoice_no').val();
            var input_amount = accounting.unformat($('#subtotal').val());
            var input_description = $("#input_description").val();

            swal({
                title: 'Are you sure?',
                text: 'Time: ' + time.format('Do MMMM YYYY h:mm:ss a') + '\nSubcontractor: ' + subcontractor + '\nAmount: ' + accounting.formatMoney(input_amount),
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Yes, add it!',
                cancelButtonText: 'No, cancel plx!',
                closeOnConfirm: false,
                closeOnCancel: false,
                customClass: 'newVariationConfirmation'
            }, function (isConfirm) {
                if (!isConfirm) {
                    swal('Cancelled', 'Your imaginary file is safe :)', 'error');
                    return;
                }
                var $button = $('.newVariationConfirmation').find('.confirm');
                var html = $button.html();
                $button.html('<i class="fa fa-spinner fa-spin"></i> ' + html);
                $button.off('click');

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
                }).done(function (data) {
                    var vid = data['vid'];
                    var successful = true;
                    $('.variationItem').each(function (i, obj) {
                        var desc = $(obj.children[0].children[0]).val();
                        var amount = $(obj.children[1].children[0]).val();
                        if (desc !== '' && amount !== '') {
                            $.ajax({
                                url: newItemUrl,
                                type: 'POST',
                                data: JSON.stringify({
                                    "variation_id": vid,
                                    "description": desc,
                                    "amount": amount
                                }),
                                contentType: 'application/json; charset=utf-8',
                                dataType: 'json'
                            });
                        }
                    });
                    if (successful) {
                        swal({
                            title: 'Nice!',
                            text: 'You created a new variation',
                            type: 'success'
                        }, function () {
                            location.reload()
                        });
                    }
                });
            });
        }
    });

    $('.input-amount').on('change', update);
});