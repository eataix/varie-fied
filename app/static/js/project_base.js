const Menu = require('./Menu');
const ProjectList = require('./ProjectList');
const ProjectInfo = require('./ProjectInfo');
const Toolbar = require('./Toolbar');
const FluxStore = require('./flux');
const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');
const EditProjectMetaForm = require('./EditProjectMetaForm')
const NewProjectForm = require('./NewProjectForm')
const NewVariationForm = require('./NewVariationForm')
const NewProgressItemsForm = require('./NewProgressItemsForm')

const metaData = $('#project-data').data();

const projectId = metaData.projectId;
const projectName = metaData.projectName;
const projectActive = metaData.projectActive === 'True';
const projectMargin = parseFloat(metaData.projectMargin);
const projectAdminFee = $.isNumeric(metaData.projectAdminFee) ? parseFloat(metaData.projectAdminFee) : 0;

const getProjectProgressItemsUrl = metaData.getProjectProgressItemsUrl;
const getProjectVariationsUrl = metaData.getProjectVariationsUrl;

const editProjectUrl = metaData.editProjectUrl;
const deleteProjectUrl = metaData.deleteProjectUrl;

(() => {
  'use strict';

  $('#delete_project').on('click', () => {
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
    }, isConfirm => {
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
      $button.html('<i class="fa fa-spinner fa-spin"></i> ' + html);

      $.ajax({
          url: deleteProjectUrl,
          type: 'DELETE',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json'
        })
        .done(() => {
          swal({
            title: 'Nice!',
            text: `You delete: ${projectName}`,
            type: 'success'
          }, () => window.location.href = '/');
        });
    });
  });

  $('#archive_project').on('click', () => {
    const action = projectActive ? 'archive' : 'unarchive';
    swal({
      title: `Are you sure to ${action} the project?`,
      //text: 'You can recover this project later!',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: `Yes, ${action} it!`,
      cancelButtonText: 'No, cancel plx!',
      closeOnConfirm: false,
      closeOnCancel: false,
      customClass: 'archiveConfirmation'
    }, isConfirm => {
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
      $button.html('<i class="fa fa-spinner fa-spin"></i> ' + html);
      $button.off('click');

      $.ajax({
          url: editProjectUrl,
          type: 'PUT',
          data: JSON.stringify({
            active: !projectActive
          }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json'
        })
        .done(() => {
          swal({
            title: 'Nice!',
            text: `You ${action}d projectName`,
            type: 'success'
          }, () => location.reload());
        });
    });
  });

  //$.fn.editable.defaults.mode = 'inline';

  const $table = $('#table');

  $table.on('editable-save.bs.table', () => {
    $('#btn-save').prop('disabled', false);
  });

  $table.on('check.bs.table check-all.bs.table check-some.bs.table', () => {
    $('#btn-delete').prop('disabled', false);
  });

  $table.on('uncheck-all.bs.table', () => {
    $('#btn-delete').prop('disabled', true);
  });

  $table.on('uncheck.bs.table	uncheck-some.bs.table', () => {
    const selected = $table.bootstrapTable('getSelections');
    if (selected.length === 0) {
      $('#btn-delete').prop('disabled', true);
    }
  });

  const store = FluxStore.store;
  const actions = FluxStore.actions;
  const changes = FluxStore.changes;

  const list_project_url = $('#meta-data').data().projectsUrl;
  const project_url = $('#project-data').data().editProjectUrl;
  const prefix = window.location.pathname.split('/')[3] === 'progress' ? 'Progress' : 'Variations';
  const alt_url = prefix === 'Progress' ? './variation' : './progress';
  const alt_text = prefix === 'Progress' ? 'Variations' : 'Progress';

  class ProjectPage extends React.Component {
    render() {
      return (
        <div>
          <Menu
            project_url={list_project_url}
            pollInterval={2000}
            store={store}
            actions={actions}
            changes={changes}
          />
          <div className="container-fluid">
          <ProjectInfo
            project_url={project_url}
            pollInterval={2000}
            prefix={prefix}
            alt_url={alt_url}
            alt_text={alt_text}
            />
          <Toolbar
            alt_text={alt_text}
            active={true}
          />
          <div id="toolbar">
            <div className="form-inline" role="form">
              <div className="form-group">
                <button id="btn-save" type="button" className="btn btn-info btn-raised" disabled>Save</button>
              </div>
              <div className="form-group">
                <button id="btn-delete" type="button" className="btn btn-danger btn-raised" disabled>Delete</button>
              </div>
            </div>
          </div>
          <table id="table" className="table table-condensed"></table>
          </div>
          <NewProjectForm />
          <NewVariationForm project_url={list_project_url} pollInterval={2000}/>
          <NewProgressItemsForm />
        </div>
      )
    }
  }

  ReactDOM.render(
    <ProjectPage />,
    document.getElementById('content')
  );
})();
