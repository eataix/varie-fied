var metaData = $('#project-data').data();
var deleteProjectUrl = metaData['deleteProjectUrl'];
var editProjectUrl = metaData['editProjectUrl'];
var getProjectProgressItemsUrl = metaData['getProjectProgressItemsUrl'];
var newProgressItemUrl = metaData['newProgressItemUrl'];
var projectActive = metaData['projectActive'];
var projectAdminFee = metaData['projectAdminFee'];
var projectId = metaData['projectId'];
var projectMargin = metaData['projectMargin'];
var projectName = metaData['projectName'];

function addProgressItemRow() {
    var newRow = $(
        '<tr class="progressItem">' +
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
        '</tr>'
    );
    $('#progressItems').append(newRow);
}

function deleteProgressItemRow(e) {
    $(e).closest('tr').remove();
}

$.ajax({
    url: getProjectProgressItemsUrl,
    type: 'GET',
    contentType: 'application/json; charset=utf-8'
}).done(function (data) {
    console.log(data);
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
            sortable: true
        }, {
            field: 'completed_value',
            title: 'Completed Value',
            halign: 'center',
            editable: {
                type: 'text'
            },
            sortable: true
        }, {
            field: 'percentage',
            title: 'Percentage',
            halign: 'center',
            sortable: true
        }],
        data: data['progress_items'],
        rowStyle: 'rowStyle',
        toolbar: '#toolbar'
    })
});

$.fn.editable.defaults.mode = 'inline';


$('#btn-add-new-progress-items').on('click', function () {
    var instance = $('#new-progress-items-form').parsley();
    instance.validate();
    if (instance.isValid()) {
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

            $('.progressItem').each(function (i, o) {
                var name = $(o).find('textarea').val();
                var contract_value = accounting.parse($(o).find('input').val());

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
                });
            });

            swal({
                title: 'Nice!',
                text: 'You saved all changes',
                type: 'success'
            }, function () {
                location.reload();
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

        var success = true;
        var selected = $table.bootstrapTable('getSelections');
        for (var i = 0; i < selected.length; ++i) {
            $.ajax({
                url: '/api/v1.0/progress_items/' + selected[i]['id'],
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

        var data = $table.bootstrapTable('getData');
        for (var key = 0; key < data.length; ++key) {
            var value = data[key];
            var id = value['id'];
            var name = value['name'];
            var contract_value = value['contract_value'];
            var completed_value = value['completed_value'];

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
            });
        }
        swal({
            title: 'Nice!',
            text: 'You saved all changes.',
            type: 'success'
        }, function () {
            location.reload();
        });
    });
});
