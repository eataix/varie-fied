const React = require('react');
const $ = require('jquery');

const Menu = require('./Menu');
const ProjectList = require('./ProjectList');
const ProjectInfo = require('./ProjectInfo');
const Toolbar = require('./Toolbar');
const FluxStore = require('./flux');

const EditProjectMetaForm = require('./EditProjectMetaForm');
const NewProjectForm = require('./NewProjectForm');
const NewVariationForm = require('./NewVariationForm');
const NewProgressItemsForm = require('./NewProgressItemsForm');

const store = FluxStore.store;
const actions = FluxStore.actions;
const changes = FluxStore.changes;

const metaData = $('#project-data').data();

const getProjectProgressItemsUrl = metaData.getProjectProgressItemsUrl;
const getProjectVariationsUrl = metaData.getProjectVariationsUrl;

const editProjectUrl = metaData.editProjectUrl;
const deleteProjectUrl = metaData.deleteProjectUrl;

class ProjectPage extends React.Component {
  constructor() {
    super();
    this.state = {
      project: null
    };
    this.loadProject = this.loadProject.bind(this);
    this.onProjectChange = this.onProjectChange.bind(this);
  }

  componentDidMount() {
    this.loadProject();
    setInterval(this.loadProject, 2000);
    store.addChangeListener(changes.PROJECT_LOADED, this.onProjectChange);
  }

  onProjectChange() {
    this.setState({
      project: store.getProject()
    });
  }

  loadProject() {
    $.ajax({
        url: editProjectUrl,
        contentType: 'application/json; charset=utf-8'
      })
      .done((data => actions.loadProject(data)).bind(this))
      .fail(((xhr, status, err) => console.error(editProjectUrl, status, err.toString())).bind(this));
  }

  render() {
    const list_project_url = $('#meta-data').data().projectsUrl;
    const prefix = this.props.progress ? 'Progress' : 'Variations';
    const alt_url = this.props.progress ? './variation' : './progress';
    const alt_text = this.props.progress ? 'Variations' : 'Progress';

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
            pollInterval={2000}
            prefix={prefix}
            alt_url={alt_url}
            alt_text={alt_text}
            project={this.state.project}
          />
          <Toolbar
            alt_text={alt_text}
            progress={this.props.progress}
            project={this.state.project}
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
        <NewProjectForm
          store={store}
          actions={actions}
          changes={changes}
        />
        <NewVariationForm
          project_url={list_project_url}
          pollInterval={2000}
          store={store}
          actions={actions}
          changes={changes}
        />
        <NewProgressItemsForm
          store={store}
          actions={actions}
          changes={changes}
        />
        <EditProjectMetaForm
          project={this.state.project}
        />
      </div>
    )
  }
}

module.exports = ProjectPage;
