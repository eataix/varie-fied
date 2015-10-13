(() => {
  'use strict';

  class ProjectItem extends React.Component {
    render() {
      return (
        <li>
          <a href={`project/${this.props.id}/progress`} style={{fontSize: '1.3em'}}>{this.props.name}</a>
        </li>
      )
    }
  }

  class ActiveProjectList extends React.Component {
    render() {
      return (
        <div>
          <ul>
            { this.props.projects.filter(p => p.active) .map((p, i) => <ProjectItem key={i} id={p.id} name={p.name}/>) }
          </ul>
        </div>
      )
    }
  }

  class InactiveProjectList extends React.Component {
    render() {
      return (
        <div>
          <ul>
            { this.props.projects.filter(p => !p.active) .map((p, i) => <ProjectItem key={i} id={p.id} name={p.name}/>) }
          </ul>
        </div>
      )
    }
  }

  class Project extends React.Component {
    constructor() {
      super();
      this.state = {
        projects: []
      };
      this.loadProjects = this.loadProjects.bind(this);
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
        .done((data =>
            this.setState({
              projects: data.projects
            })
        ).bind(this))
        .fail(((xhr, status, err) =>
            console.error(this.props.project_url, status, err.toString())
        ).bind(this));
    }

    render() {
      return (
        <div>
          <h1>Active projects</h1>
          <ActiveProjectList projects={this.state.projects}/>
          <h1>Previous projects</h1>
          <InactiveProjectList projects={this.state.projects}/>
        </div>
      );
    }
  }

  const project_url = $('#meta-data').data().projectsUrl;

  ReactDOM.render(
    <Project
      project_url={project_url}
      pollInterval={2000}
    />,
    document.getElementById('content')
  );
})();
