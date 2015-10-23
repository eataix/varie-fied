import React from 'react';
import { connect } from 'react-redux';

import { loadProject } from './redux/actions';

import Menu from './Menu';
import ProjectList from './ProjectList';
import ProjectInfo from './ProjectInfo';
import Toolbar from './Toolbar';
import EditProjectMetaForm from './EditProjectMetaForm';
import NewProjectForm from './NewProjectForm';
import NewVariationForm from './NewVariationForm';
import NewProgressItemsForm from './NewProgressItemsForm';

import { editProjectUrl } from './defs';
import { initProgressTable, handleSaveProgress, handleDeleteProgress } from './progress_fn';
import { initVariationTable, handleSaveVariation, handleDeleteVariation } from './variation_fn';

class Table extends React.Component {
  componentDidMount() {
    if (this.props.progress) {
      initProgressTable(this.refs.table);
    } else {
      initVariationTable(this.refs.table);
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <table
        ref='table'
        id='table'
        className='table table-condensed'
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    project: state.project
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadProject: (project) => dispatch(loadProject(project))
  };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ProjectPage extends React.Component {
  constructor() {
    super();
    this.loadProject = this.loadProject.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.loadProject();
    setInterval(this.loadProject, 10000);

  }

  handleSave() {
    if (this.props.progress) {
      handleSaveProgress();
    } else {
      handleSaveVariation();
    }
  }

  handleDelete() {
    if (this.props.progress) {
      handleDeleteProgress();
    } else {
      handleDeleteVariation();
    }
  }

  loadProject() {
    $.ajax({
        url: editProjectUrl,
        contentType: 'application/json; charset=utf-8'
      })
      .done((data => this.props.loadProject(data)).bind(this))
      .fail(((xhr, status, err) => console.error(editProjectUrl, status, err.toString())).bind(this));
  }

  render() {
    const prefix = this.props.progress ? 'Progress' : 'Variations';
    const alt_url = this.props.progress ? './variation' : './progress';
    const alt_text = this.props.progress ? 'Variations' : 'Progress';

    return (
      <div>
        <Menu pollInterval={10000}/>
        <div className="container-fluid">
          <ProjectInfo
            pollInterval={10000}
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
                  onClick={this.handleSave}
                >
                  Save
                </button>
              </div>
              <div className="form-group">
                <button
                  id="btn-delete"
                  type="button"
                  className="btn btn-danger btn-raised"
                  onClick={this.handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          <Table progress={this.props.progress}/>
        </div>
        <NewProjectForm />
        <NewVariationForm
          pollInterval={10000}
        />
        <NewProgressItemsForm />
        <EditProjectMetaForm
          project={this.props.project}
        />
      </div>
    )
  }
}
ProjectPage.propTypes = {
  progress: React.PropTypes.bool.isRequired
};

