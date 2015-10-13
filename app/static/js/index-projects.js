(() => {
  'use strict';

  const Project = React.createClass({
    getInitialState: function() {
      return {
        projects: []
      };
    },
    componentDidMount: function() {
      this.loadProjects();
      setInterval(this.loadProjects, this.props.pollInterval);
    },
    loadProjects: function() {
      $.ajax({
            url: this.props.project_url,
            dataType: "json",
            contentType: 'application/json; charset=utf-8'
          })
          .success((data =>
                  this.setState({projects: data.projects})
          ).bind(this))
          .fail(((xhr, status, err) =>
                  console.error(this.props.project_url, status, err.toString())
          ).bind(this));
    },
    render: function() {
      return (
          <div>
            <h1>Active projects</h1>
            <div>
              <ul>
                {this.state.projects.map(function(project) {
                  if (project.active) {
                    return (
                        <li key={project.id}>
                          <a href={`project/${project.id}/progress`} style={{fontSize: '1.3em'}}>{project.name}</a>
                        </li>
                    )
                  } else {
                    return false;
                  }
                })
                }
              </ul>
            </div>
            <h1>Previous projects</h1>
            <div>
              <ul>
                {this.state.projects.map(function(project) {
                  if (!project.active) {
                    return (
                        <li key={project.id}>
                          <a href={`project/${project.id}/progress`} style={{fontSize: '1.3em'}}>{project.name}</a>
                        </li>
                    )
                  } else {
                    return false;
                  }
                })
                }
              </ul>
            </div>
          </div>
      );
    }
  });

  const project_url = $('#meta-data').data().projectsUrl;

  ReactDOM.render(
      <Project project_url={project_url} pollInterval={2000}/>,
      document.getElementById('content')
  );
})();
