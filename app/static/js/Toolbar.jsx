import React from "react";
import _ from "lodash";

import {deleteProjectUrl, editProjectUrl, projectName} from "./defs";

class Toolbar extends React.Component {
    constructor() {
        super();
        this.handleArchive = this.handleArchive.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    render() {
        if (_.isNull(this.props.project)) {
            return false;
        }
        let mid; // eslint-disable-line
        if (this.props.progress) {
            mid = (
                <button
                    className="btn btn-primary btn-raised"
                    data-toggle="modal"
                    data-target="#new-progress-item-dialog"
                >
                    <span className="fa fa-plus"/> New Items
                </button>
            );
        } else {
            mid = (
                <button
                    className="btn btn-primary btn-raised"
                    data-toggle="modal"
                    data-target="#new-variation-dialog"
                >
                    <span className="fa fa-plus"/> Add Variation
                </button>
            );
        }

        return (
            <div
                className="btn-toolbar"
                role="toolbar"
                aria-label="..."
            >
                <a
                    className="btn btn-info btn-raised"
                    href={`/export/${this.props.project.id}`}
                >
                    <span className="fa fa-download"/> Export Project
                </a>
                {mid}
                <button
                    id="archive_project"
                    type="button"
                    className="btn btn-info btn-raised"
                    onClick={this.handleArchive}
                >
          <span
              className="fa fa-check-square-o"/>{ this.props.project.active ? 'Archive Project' : 'Unarchive Project' }
                </button>
                <button
                    id="delete_project"
                    type="button"
                    className="btn btn-danger btn-raised"
                    onClick={this.handleDelete}
                >
                    <span className="fa fa-trash"/> Delete Project
                </button>
            </div>
        );
    }

    handleDelete() {
        swal({
            title: 'Are you sure to delete this project?',
            text: `You are going to delete project ${projectName}`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel plx!',
            closeOnConfirm: false,
            closeOnCancel: false,
            customClass: 'deleteConfirmation'
        }, (isConfirm) => {
            if (!isConfirm) {
                swal({
                    title: 'Cancelled',
                    text: 'Your project is safe :)',
                    type: 'error'
                });
                return;
            }
            const $button = $('.deleteConfirmation').find('.confirm');
            const html = $button.html();
            $button.html(`<span class="fa fa-spinner fa-spin"></span> ${html}`);

            $.ajax({
                url: deleteProjectUrl,
                type: 'DELETE',
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            }).done(() => {
                swal({
                    title: 'Nice!',
                    text: `You delete: ${projectName}`,
                    type: 'success'
                }, () => {
                    window.location.href = '/';
                });
            });
        });
    }

    handleArchive() {
        const action = this.props.project.active ? 'archive' : 'unarchive';
        swal({
            title: `Are you sure to ${action} the project?`,
            type: 'info',
            showCancelButton: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: `Yes, ${action} it!`,
            cancelButtonText: 'No, cancel plx!',
            closeOnConfirm: false,
            closeOnCancel: false,
            customClass: 'archiveConfirmation'
        }, (isConfirm) => {
            if (!isConfirm) {
                swal({
                    title: 'Cancelled',
                    text: 'The project file is safe :)',
                    type: 'error'
                });
                return;
            }
            const $button = $('.archiveConfirmation').find('.confirm');
            const html = $button.html();
            $button.html(`<span class="fa fa-spinner fa-spin"></span> ${html}`);

            $.ajax({
                url: editProjectUrl,
                type: 'PUT',
                data: JSON.stringify({
                    active: !this.props.project.active
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json'
            }).done(() => {
                swal({
                    title: 'Nice!',
                    text: `You ${action}d projectName`,
                    type: 'success'
                }, () => location.reload());
            });
        });
    }
}
Toolbar.propTypes = {
    project: React.PropTypes.object,
    progress: React.PropTypes.bool
};

export default Toolbar;

