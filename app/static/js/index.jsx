const Menu = require('./Menu');
const ProjectList = require('./ProjectList');
const FluxStore = require('./flux');
const React = require('react');
const ReactDOM = require('react-dom');
const $ = require('jquery');

(() => {
  const store = FluxStore.store;
  const actions = FluxStore.actions;
  const changes = FluxStore.changes;

  const project_url = $('#meta-data').data().projectsUrl;

  class FrontPage extends React.Component {
    render() {
      return (
        <div>
          <Menu
            project_url={project_url}
            pollInterval={2000}
            store={store}
            actions={actions}
            changes={changes}
          />
          <div className='container'>
            <ProjectList
              project_url={project_url}
              pollInterval={2000}
              store={store}
              actions={actions}
              changes={changes}
            />
          </div>
        </div>
      )
    }
  }

  ReactDOM.render(
    <FrontPage />,
    document.getElementById('content')
  );
})();
