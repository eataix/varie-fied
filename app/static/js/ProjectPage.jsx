import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';

import Menu from './Menu';
import ProjectList from './ProjectList';
import ProjectInfo from './ProjectInfo';
import Toolbar from './Toolbar';

import EditProjectMetaForm from './EditProjectMetaForm';
import NewProjectForm from './NewProjectForm';
import NewVariationForm from './NewVariationForm';
import NewProgressItemsForm from './NewProgressItemsForm';

import { loadProject } from './redux/actions';

const metaData = $('#project-data').data();
const editProjectUrl = metaData.editProjectUrl;

class ProjectPage extends React.Component {
  constructor() {
    super();
    this.loadProject = this.loadProject.bind(this);
  }

  componentDidMount() {
    this.loadProject();
    setInterval(this.loadProject, 2000);
  }

  loadProject() {
    $.ajax({
        url: editProjectUrl,
        contentType: 'application/json; charset=utf-8'
      })
      .done((data => this.props.dispatch(loadProject(data))).bind(this))
      .fail(((xhr, status, err) => console.error(editProjectUrl, status, err.toString())).bind(this));
  }

  render() {
    const prefix = this.props.progress ? 'Progress' : 'Variations';
    const alt_url = this.props.progress ? './variation' : './progress';
    const alt_text = this.props.progress ? 'Variations' : 'Progress';

    return (
      <div>
        <Menu pollInterval={2000}/>
        <div className="container-fluid">
          <ProjectInfo
            pollInterval={2000}
            prefix={prefix}
            alt_url={alt_url}
            alt_text={alt_text}
            project={this.props.project}
          />
          <Toolbar
            alt_text={alt_text}
            progress={this.props.progress}
            project={this.props.project}
          />
          <div id="toolbar">
            <div className="form-inline" role="form">
              <div className="form-group">
                <button
                  id="btn-save"
                  type="button"
                  className="btn btn-info btn-raised"
                  disabled
                >
                  Save
                </button>
              </div>
              <div className="form-group">
                <button
                  id="btn-delete"
                  type="button"
                  className="btn btn-danger btn-raised"
                  disabled
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          <table
            id="table"
            className="table table-condensed"
          />
        </div>
        <NewProjectForm />
        <NewVariationForm
          pollInterval={2000}
        />
        <NewProgressItemsForm />
        <EditProjectMetaForm
          project={this.props.project}
        />
      </div>
    )
  }
}

export default connect(s=>s)(ProjectPage);
