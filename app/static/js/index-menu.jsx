(() => {
  'use strict';

  var Home = React.createClass({
    render: function() {
      if (window.location.pathname === '/') {
        return (
            <li className='active'>
              <a href="/"><i className="fa fa-home"> </i>Home</a>
            </li>
        );
      } else {
        return (
            <li>
              <a href="/"><i className="fa fa-home"> </i>Home</a>
            </li>
        );
      }
    }
  });
  var ProjectItem = React.createClass({
    render: function() {
      if (!this.props.project.active) {
        return false;
      }
      var id = window.location.pathname.split('/')[2];
      if (id === this.props.project.id.toString()) {
        return (
            <li className="dropdown active">
              <a href="javascript:void(0)" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                <i className="fa fa-folder-open"></i> {this.props.project.name}<span className="caret"></span>
              </a>
              <ul className="dropdown-menu">
                <li><a href={`/project/${this.props.project.id}/progress`}>Progress</a></li>
                <li><a href={`/project/${this.props.project.id}/variation`}>Variations</a></li>
              </ul>
            </li>
        );
      } else {
        return (
            <li className="dropdown">
              <a href="javascript:void(0)" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                <i className="fa fa-folder"></i> {this.props.project.name}<span className="caret"></span>
              </a>
              <ul className="dropdown-menu">
                <li><a href={`/project/${this.props.project.id}/progress`}>Progress</a></li>
                <li><a href={`/project/${this.props.project.id}/variation`}>Variations</a></li>
              </ul>
            </li>
        )
      }
    }
  });

  var OldProject = React.createClass({
    render: function() {
      let p = undefined;
      if (window.location.pathname !== '/') {
        const id = window.location.pathname.split('/')[2];
        p = this.props.projects.find(function(e) {
          return e.active && e.id.toString() === id;
        });
      }
      if (window.location.pathname !== '/' && p === undefined) {
        return (
            <li className="dropdown active">
              <a href="javascript:void(0)" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown">
                Archived Projects <span className="caret"></span></a>
              <ul className="dropdown-menu">
                {
                    this.props.projects.map(function(p, i) {
                        if (p.active) {
                            return false;
                            }
                        return (
                        <li key={i}>
                          <a href={`/project/${p.id}/progress`}>{p.name}</a>
                        </li>
                            );
                        })
                    }
              </ul>
            </li>
        )
      } else {
        return (
            <li className="dropdown">
              <a href="javascript:void(0)" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown">
                Archived Projects <span className="caret"></span></a>
              <ul className="dropdown-menu">
                {
                    this.props.projects.map(function(p, i) {
                        if (p.active) {
                            return false;
                            }
                        return (
                        <li key={i}>
                          <a href={`/project/${p.id}/progress`}>{p.name}</a>
                        </li>
                            );
                        })
                    }
              </ul>
            </li>
        )
      }
    }
  });

  var Project = React.createClass({
    getInitialState: function() {
      return {
        projects: []
      }
    },
    componentDidMount: function() {
      this.loadProjects();
      setInterval(this.loadProjects, this.props.pollInterval);
    },
    loadProjects: function() {
      $.ajax({
        url: this.props.project_url,
        dataType: 'json',
        success: function(data) {
          this.setState({
            projects: data.projects
          });
        }.bind(this),
        fail: function(xhr, status, err) {
          console.error(this.props.project_url, status, err.toString())
        }.bind(this)
      });
    },
    render: function() {
      return (
          <div className="navbar navbar-default" role="navigation">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-responsive-collapse">
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="/">Varie-fied</a>
            </div>
            <div className="navbar-collapse collapse navbar-responsive-collapse">
              <ul className="nav navbar-nav">
                <Home />
                {
                    this.state.projects.map(function(p, i) {
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
  });

  var project_url = $('#meta-data').data().projectsUrl;

  ReactDOM.render(
      <Project project_url={project_url} pollInterval={2000}/>,
      document.getElementById('navbar-menu')
  );
})();