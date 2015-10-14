const React = require('react');
const $ = require('jquery');

const Menu = require('./Menu');
const ProjectList = require('./ProjectList');

const NewProjectForm = require('./NewProjectForm');
const NewVariationForm = require('./NewVariationForm');
const NewProgressItemsForm = require('./NewProgressItemsForm');

const FluxStore = require('./flux');
const store = FluxStore.store;
const actions = FluxStore.actions;
const changes = FluxStore.changes;

const list_all_projects_url = $('#meta-data').data().projectsUrl;

class FrontPage extends React.Component {
  render() {
    return (
      <div>
        <Menu
          project_url={list_all_projects_url}
          pollInterval={2000}
          store={store}
          actions={actions}
          changes={changes}
        />
        <div className='container'>
          <ProjectList
            project_url={list_all_projects_url}
            pollInterval={2000}
            store={store}
            actions={actions}
            changes={changes}
          />
        </div>

        <NewProjectForm
          store={store}
          actions={actions}
          changes={changes}
        />
        <NewVariationForm
          project_url={list_all_projects_url}
          pollInterval={2000}
          store={store}
          actions={actions}
          changes={changes}
        />
      </div>
    )
  }
}

module.exports = FrontPage;