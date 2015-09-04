(function () {
    var metaData = $('#project-data').data();
    var deleteProjectUrl = metaData['deleteProjectUrl'];
    var editProjectUrl = metaData['editProjectUrl'];
    var getProjectVariationsUrl = metaData['getProjectVariationsUrl'];
    var projectActive = metaData['projectActive'];
    var projectAdminFee = metaData['projectAdminFee'];
    var projectId = metaData['projectId'];
    var projectMargin = metaData['projectMargin'];
    var projectName = metaData['projectName'];

    function pendingClick(cb) {
        var $tr = $(cb).parents('tr');
        $tr.attr('class', 'info');
        $tr.find('.checkbox-approved').prop('checked', false);
        $tr.find('.checkbox-declined').prop('checked', false);
        $('#btn-save').prop('disabled', false);
    }

    function pendingFormatter(value, row, index) {
        var mid;
        if (value) {
            mid = '<input class="checkbox checkbox-pending" type="checkbox" checked="" onclick="pendingClick(this);">';
        } else {
            mid = '<input class="checkbox checkbox-pending" type="checkbox" onclick="pendingClick(this);">';
        }
        return '<label>' + mid + '</label>';
    }

    function approvedClick(cb) {
        var $tr = $(cb).parents('tr');
        $tr.attr('class', 'success');
        $tr.find('.checkbox-pending').prop('checked', false);
        $tr.find('.checkbox-declined').prop('checked', false);
        $('#btn-save').prop('disabled', false);
    }

    function approvedFormatter(value, row, index) {
        var mid;
        if (value) {
            mid = '<input class="checkbox checkbox-approved" type="checkbox" checked="" onclick="approvedClick(this);">';
        } else {
            mid = '<input class="checkbox checkbox-approved" type="checkbox" onclick="approvedClick(this);">';
        }
        return '<label>' + mid + '</label>';
    }

    function declinedClick(cb) {
        var $tr = $(cb).parents('tr');
        $tr.attr('class', 'danger');
        $tr.find('.checkbox-pending').prop('checked', false);
        $tr.find('.checkbox-approved').prop('checked', false);
        $('#btn-save').prop('disabled', false);
    }

    function declinedFormatter(value, row, index) {
        var mid;
        if (value) {
            mid = '<input class="checkbox checkbox-declined" type="checkbox" checked="" onclick="declinedClick(this);">';
        } else {
            mid = '<input class="checkbox checkbox-declined" type="checkbox" onclick="declinedClick(this);">';
        }
        return '<label>' + mid + '</label>';
    }

    function completeClick(cb) {
        $('#btn-save').prop('disabled', false);
    }

    function completeFormatter(value, row, index) {
        var mid;
        if (value) {
            mid = '<input class="checkbox checkbox-complete" type="checkbox" checked="" onclick="completeClick(this);">';
        } else {
            mid = '<input class="checkbox checkbox-complete" type="checkbox" onclick="completeClick(this);">';
        }
        return '<label>' + mid + '</label>';
    }

    function rowStyle(row, index) {
        if (row['pending']) {
            return {classes: 'info'};
        } else if (row['approved']) {
            return {classes: 'success'};
        } else if (row['declined']) {
            return {classes: 'danger'};
        } else {
            return {classes: 'active'};
        }
    }

    function timeFormatter(value, row, index) {
        return '<p>' + moment(value).toDate() + '</p>';
    }

    function moneyFormatter(value, row, index) {
        return accounting.formatMoney(value);
    }

    function validate_required(v) {
        if (v === null || v === '') {
            return "Cannot be empty!";
        }
    }

    function detailFormatter(index, row) {
        var url = '/api/v1.0/variations/' + row['vid'] + '/items/';
        var that = this;
        setTimeout(function () {
            $.ajax({
                url: url,
                type: 'GET',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            }).done(function (data) {
                var items = data['items'];
                var html =
                    '<table class="table table-hover">' +
                    '<thead>' +
                    '<tr>' +
                    '<th style="text-align: center">Name</th>' +
                    '<th style="text-align: center">Amount</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>';
                var descriptionClass = 'new-editable-description-' + index;
                var amountClass = 'new-editable-amount-' + index;

                for (var i = 0; i < items.length; ++i) {
                    var item = items[i];
                    var id = item['id'];
                    var description = '<a href="javascript:void(0)" data-type="textarea" pk=' + id + ' class="' + descriptionClass + '">' + item.description + '</a>';
                    var amount = '<a href="javascript:void(0)" data-type="textarea" pk=' + id + ' class="' + amountClass + '">' + item.amount + '</a>';
                    html += '<tr class="item-detail"><td>' + description + '</td><td style="text-align: right;width: 200px">' + amount + '</td></tr>';
                }
                html += '</tbody>' + '</table>';

                $($('[data-index=' + index + ']').next()).children().html(html);
                $('.' + descriptionClass).editable();
                $('.' + amountClass).editable();
                $('.' + descriptionClass).on('save', function (e, params) {
                    $("#btn-save").prop('disabled', false);
                });
                $('.' + amountClass).on('save', function (e, params) {
                    $("#btn-save").prop('disabled', false);
                    var total = 0.0;
                    $('.' + amountClass).each(function (i, o) {
                        if (o !== e['target']) {
                            var val = $(o).html();
                            if (val !== "" && isNumeric(val)) {
                                total += parseFloat(val);
                            }
                        } else {
                            total += parseFloat(params.newValue);
                        }
                    });
                    total *= 1.0 + projectMargin;
                    if (projectAdminFee !== '') {
                        total += projectAdminFee;
                    }
                    $(that).closest('.detail-view').prev().children('.subtotal').html('<b>' + accounting.formatMoney(total) + '</b>');
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
    }).done(function (data) {
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
            data: data['variations'],
            rowStyle: 'rowStyle',
            toolbar: '#toolbar',
            detailView: true,
            detailFormatter: 'detailFormatter'
        });
    }).always(function () {
        $('body').addClass('loaded');
    });

    $.fn.editable.defaults.mode = 'inline';

    $(document).ready(function () {
        $('#delete_project').on('click', function (e) {
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
            }, function (isConfirm) {
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
                }).done(function () {
                    swal({
                        title: 'Nice!',
                        text: 'You delete: {{ current_project.name }}',
                        type: 'success'
                    }, function () {
                        window.location.href = "/";
                    });
                });
            });
        });

        $('#archive_project').on('click', function (e) {
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
            }, function (isConfirm) {
                if (!isConfirm) {
                    swal('Cancelled', 'The project file is safe :)', 'error');
                    return;
                }
                var $button = $('.archiveConfirmation').find('.confirm');
                var html = $button.html();
                $button.html('<i class="fa fa-spinner fa-spin"></i> ' + html);
                $button.off('click');

                var active = null;
                if (projectActive === 'True') {
                    active = false;
                } else {
                    active = true;
                }
                $.ajax({
                    url: editProjectUrl,
                    type: 'PUT',
                    data: JSON.stringify({
                        "active": active
                    }),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json'
                }).done(function () {
                    swal({
                        title: 'Nice!',
                        text: 'You ' + action + ': {{ current_project.name }}',
                        type: 'success'
                    }, function () {
                        location.reload()
                    });
                });
            });
        });

        $('#btn-save-meta').on('click', function (e) {
            var instance = $('#edit-project-meta-form').parsley();
            instance.validate();
            if (instance.isValid()) {
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
                }, function (isConfirmed) {
                    if (!isConfirmed) {
                        swal('Cancelled', 'Your project is safe :)', 'error');
                        return;
                    }
                    var $button = $('.saveMetaConfirmation').find('.confirm');
                    var html = $button.html();
                    $button.html('<i class="fa fa-spinner fa-spin"></i> ' + html);
                    $button.off('click');

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
                            "name": new_name,
                            "margin": new_margin,
                            "admin_fee": new_admin_fee,
                            "reference_number": new_reference_number
                        }),
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json'
                    }).done(function () {
                        swal({
                            title: 'Nice!',
                            text: 'Save changes',
                            type: 'success'
                        }, function () {
                            location.reload()
                        });
                    });
                });
            }
        });

        var $table = $('#table');
        $table.on('editable-save.bs.table', function (rows) {
            $('#btn-save').prop('disabled', false);
        });
        $table.on('check.bs.table check-all.bs.table check-some.bs.table', function (rows) {
            $('#btn-delete').prop('disabled', false);
        });
        $table.on('uncheck-all.bs.table', function (rows) {
            $('#btn-delete').prop('disabled', true);
        });
        $table.on('uncheck.bs.table	uncheck-some.bs.table', function (rows) {
            var selected = $table.bootstrapTable('getSelections');
            if (selected == 0) {
                $('#btn-delete').prop('disabled', true);
            }
        });

        $('#btn-delete').on('click', function (e) {
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
            }, function (isConfirmed) {
                if (!isConfirmed) {
                    swal('Cancelled', 'Your project is safe :)', 'error');
                    return;
                }
                var $button = $('.deleteRowsConfirmation').find('.confirm');
                var html = $button.html();
                $button.html('<i class="fa fa-spinner fa-spin"></i> ' + html);
                $button.off('click');

                var success = true;
                var selected = $table.bootstrapTable('getSelections');
                for (var i = 0; i < selected.length; ++i) {
                    $.ajax({
                        url: '/api/v1.0/variations/' + selected[i]['vid'],
                        type: 'DELETE',
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json'
                    }).fail(function () {
                        success = false;
                    });
                }
                if (success) {
                    swal({
                        title: 'Nice!',
                        text: 'Delete variations',
                        type: 'success'
                    }, function () {
                        location.reload()
                    });
                }
            });
        });

        $('#btn-save').on('click', function (e) {
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
            }, function (isConfirm) {
                if (!isConfirm) {
                    swal('Cancelled', 'Your saves are unsaved', 'error');
                    return;
                }

                var $button = $('.saveVariationsConfirmation').find('.confirm');
                var html = $button.html();
                $button.html('<i class="fa fa-spinner fa-spin"></i> ' + html);
                $button.off('click');

                var data = $table.bootstrapTable('getData');
                for (var key = 0; key < data.length; ++key) {
                    var value = data[key];
                    var vid = value['vid'];
                    var selector = '[data-index=' + key + ']';
                    var element = $(selector);
                    value['pending'] = element.find('.pending').children().children().is(':checked');
                    value['approved'] = element.find('.approved').children().children().is(':checked');
                    value['declined'] = element.find('.declined').children().children().is(':checked');
                    value['completed'] = element.find('.completed').children().children().is(':checked');
                    value['amount'] = accounting.parse(element.find('.subtotal').html());

                    $.ajax({
                        url: '/api/v1.0/variations/' + vid,
                        type: 'PUT',
                        data: JSON.stringify(value),
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json'
                    });
                }
                $('.item-detail').each(function (i, o) {
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
                            "amount": amount,
                            "description": description
                        }),
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json'
                    });
                });
                swal({
                    title: 'Nice!',
                    text: 'You saved all changes.',
                    type: 'success'
                }, function () {
                    location.reload();
                });
            });
        });
    });
})();