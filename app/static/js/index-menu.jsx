(() => {
  'use strict';

  var NavItem = ReactBootstrap.NavItem;

  class Home extends React.Component {
    render() {
      return (
          <NavItem active={window.location.pathname === '/'} href='/'>
            <i className="fa fa-home"> </i>Home
          </NavItem>
      );
    }
  }

  class ProjectItem extends React.Component {
    render() {
      const id = window.location.pathname.split('/')[2];
      const active = id === this.props.project.id.toString();
      const className = active ? "dropdown active" : "dropdown";
      const iClassName = active ? "fa fa-folder-open" : "fa fa-folder";
      return (
          <li className={className}>
            <a href="javascript:void(0)" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
              <i className={iClassName}></i> {this.props.project.name}<span className="caret"></span>
            </a>
            <ul className="dropdown-menu">
              <li><a href={`/project/${this.props.project.id}/progress`}>Progress</a></li>
              <li><a href={`/project/${this.props.project.id}/variation`}>Variations</a></li>
            </ul>
          </li>
      );
    }
  }

  class OldProject extends React.Component {
    render() {
      let p = undefined;
      if (window.location.pathname !== '/') {
        const id = window.location.pathname.split('/')[2];
        p = this.props.projects.find(function(e) {
          return e.active && e.id.toString() === id;
        });
      }
      const active = window.location.pathname !== '/' && p === undefined;
      const className = active ? "dropdown active" : "dropdown";
      return (
          <li className={className}>
            <a href="javascript:void(0)" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown">
              Archived Projects <span className="caret"></span></a>
            <ul className="dropdown-menu">
              { this.props.projects
                  .filter(function(e) {
                  return !e.active;
                  })
                  .map(function(p, i) {
                  return (
                  <li key={i}>
                    <a href={`/project/${p.id}/progress`}>{p.name}</a>
                  </li>
                      );
                  })
                  }
            </ul>
          </li>
      );
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
          <div className="navbar navbar-default" role="navigation">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-responsive-collapse">
                <span className="icon-bar">
                </span>
                <span className="icon-bar">
                </span>
                <span className="icon-bar">
                </span>
              </button>
              <a className="navbar-brand" href="/">Varie-fied</a>
            </div>
            <div className="navbar-collapse collapse navbar-responsive-collapse">
              <ul className="nav navbar-nav">
                <Home />
                {
                    this.state.projects
                        .filter(p => p.active)
                        .map(function(p, i) {
                        return <ProjectItem key={i} project={p}/>;
                        })
                    }
                <OldProject projects={this.state.projects}/>
                <li>
                  <a href="javascript:void(0)" data-toggle="modal" data-target="#new-project-dialog"><i className="fa fa-plus"></i>
                    New Project</a>
                </li>
                <li>
                  <a href="javascript:void(0)" data-toggle="modal" data-target="#new-variation-dialog"><i className="fa fa-plus"></i>
                    New Variation</a>
                </li>
              </ul>
            </div>
          </div>
      );
    }
  }

  const project_url = $('#meta-data').data().projectsUrl;

  ReactDOM.render(
      <Project project_url={project_url} pollInterval={2000}/>,
      document.getElementById('navbar-menu')
  );
})();