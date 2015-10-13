(() => {
  'use strict';

  class Project extends React.Component {
    constructor() {
      super();
      this.state = {
        projects: []
      };
    }

    componentDidMount() {
      this.loadProjects();
      setInterval(this.loadProjects, this.props.pollInterval);
    }

    loadProjects() {
      $.ajax({
            url: this.props.project_url,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8'
          })
          .success((data =>
                  this.setState({projects: data.projects})
          ).bind(this))
          .fail(((xhr, status, err) =>
                  console.error(this.props.project_url, status, err.toString())
          ).bind(this));
    }

    render() {
      return (
          <div>
            <h1>Active projects</h1>
            <div>
              <ul>
                {
                    this.state.projects
                        .filter(p => p.active)
                        .map(function(project) {
                        return (
                        <li key={project.id}>
                          <a href={`project/${project.id}/progress`} style={{fontSize: '1.3em'}}>{project.name}</a>
                        </li>
                            );
                        })
                    }
              </ul>
            </div>
            <h1>Previous projects</h1>
            <div>
              <ul>
                {
                    this.state.projects
                        .filter(p => !p.active)
                        .map(function(project) {
                        return (
                        <li key={project.id}>
                          <a href={`project/${project.id}/progress`} style={{fontSize: '1.3em'}}>{project.name}</a>
                        </li>
                            );
                        })
                    }
              </ul>
            </div>
          </div>
      );
    }
  }

  const project_url = $('#meta-data').data().projectsUrl;

  ReactDOM.render(
      <Project project_url={project_url} pollInterval={2000}/>,
      document.getElementById('content')
  );
})();
