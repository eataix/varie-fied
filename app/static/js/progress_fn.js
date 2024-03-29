import {getProjectProgressItemsUrl, isFalse, isNull, isTrue} from "./defs";
import {spinInterval} from "./config";


import _ from "lodash";

let $table = null;

const setCallback = () => {
    $table.on('editable-save.bs.table', () => {
        window.onbeforeunload = () => {
            return 'You have unsaved changes.';
        };
        let sum = 0.0;
        let sum2 = 0.0;
        const data = $table.bootstrapTable('getData');
        data.forEach((progress_item, idx) => {
            if (idx < data.length - 1) {
                sum += parseFloat(progress_item.completed_value);
                sum2 += parseFloat(progress_item.contract_value);
            }
        });
        $table.bootstrapTable('updateRow', {
            index: data.length - 1,
            row: {
                completed_value: sum,
                contract_value: sum2,
                percentage: sum / sum2,
                name: 'TOTALS'
            }
        });
    });
};

const removeCallback = () => {
    window.onbeforeunload = null;
};

const exportFunctions = () => {
    window.percentageFormatter = (value) => {
        return `${(value * 100.0).toFixed(2)}%`;
    };
};

export const initProgressTable = (table) => {
    if (_.isNull($table)) {
        $table = $(table);
        exportFunctions();
    }

    $.ajax({
        url: getProjectProgressItemsUrl,
        type: 'GET',
        contentType: 'application/json; charset=utf-8'
    }).done((data) => {
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
            data: data.progress_items
        });

        let sum = 0.0;
        let sum2 = 0.0;
        data.progress_items.forEach((progress_item) => {
            sum += progress_item.completed_value;
            sum2 += progress_item.contract_value;
        });
        $table.bootstrapTable('insertRow', {
            index: data.progress_items.length,
            row: {
                completed_value: sum,
                contract_value: sum2,
                percentage: sum / sum2,
                name: 'TOTALS'
            }
        });
    }).always(() => {
        $('body').addClass('loaded');
    });

    setCallback();
};

export const handleSaveProgress = () => {
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
                text: 'Your saves are unsaved',
                type: 'error'
            });
            return;
        }

        const data = $table.bootstrapTable('getData');
        const statusArray = new Array(data.length - 1).fill(null);

        (() => {
            const updateProgressItems = (offset = 0) => {
                if (offset >= data.length - 1) {
                    return;
                }
                const value = data[offset];

                const id = value.id;
                const name = value.name;
                const contract_value = parseFloat(value.contract_value);
                const completed_value = parseFloat(value.completed_value);

                $.ajax({
                    url: `/api/v1.0/progress_items/${id}`,
                    type: 'PUT',
                    data: JSON.stringify({
                        name,
                        contract_value,
                        completed_value
                    }),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json'
                }).done(() => {
                    statusArray[offset] = true;
                }).fail(() => {
                    statusArray[offset] = false;
                });

                updateProgressItems(offset + 1);
            };
            updateProgressItems(0);
        })();

        (() => {
            const waiting = () => {
                if (statusArray.some(isFalse)) {
                    swal({
                        title: 'Error',
                        text: 'Cannot save the changes... Please try again.',
                        type: 'error'
                    });
                } else if (statusArray.some(isNull)) {
                    setTimeout(waiting, spinInterval);
                } else if (statusArray.every(isTrue)) {
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

export const handleDeleteProgress = () => {
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

        const selected = $table.bootstrapTable('getSelections');
        const statusArray = new Array(selected.length - 1).fill(null);

        (() => {
            const saveSelections = (offset = 0) => {
                if (offset >= selected.length || _.isUndefined(selected[offset].id)) {
                    return;
                }
                $.ajax({
                    url: `/api/v1.0/progress_items/${selected[offset].id}`,
                    type: 'DELETE',
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json'
                }).done(() => {
                    statusArray[offset] = true;
                }).fail(() => {
                    statusArray[offset] = false;
                });
                saveSelections(offset + 1);
            };
            saveSelections(0);
        })();

        (() => {
            const waiting = () => {
                if (statusArray.some(isFalse)) {
                    swal({
                        title: 'Error',
                        text: 'Failed to delete some items.',
                        type: 'error'
                    });
                } else if (statusArray.some(isNull)) {
                    setTimeout(waiting, spinInterval);
                } else if (statusArray.every(isTrue)) {
                    swal({
                        title: 'Nice!',
                        text: 'Deleted selected items',
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

