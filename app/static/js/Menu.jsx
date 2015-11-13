import React from 'react';
import { connect } from 'react-redux';
import { NavItem } from 'react-bootstrap';

import { loadProjects } from './redux/actions';
import { projectsUrl } from './defs';
import { pollInterval } from './config';

class HomeBar extends React.Component {
  render() {
    const active = window.location.pathname === '/';
    return (
      <NavItem
        active={active}
        href="/"
      >
        <span className="fa fa-home"/> Home
      </NavItem>
    );
  }
}

class ProjectItem extends React.Component {
  render() {
    if (!this.props.project.active) {
      return false;
    }
    const active = window.location.pathname.split('/')[2] === this.props.project.id.toString();
    const className = active ? 'dropdown active' : 'dropdown';
    const iClassName = active ? 'fa fa-folder-open' : 'fa fa-folder';
    return (
      <li className={className}>
        <a
          href="javascript:void(0)"
          className="dropdown-toggle"
          data-toggle="dropdown"
          data-hover="dropdown"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
        >
          <span className={iClassName}/> {this.props.project.name}<span className="caret"/>
        </a>
        <ul className="dropdown-menu">
          <li>
            <a href={`/project/${this.props.project.id}/progress`}>Progress</a>
          </li>
          <li>
            <a href={`/project/${this.props.project.id}/variation`}>Variations</a>
          </li>
        </ul>
      </li>
    );
  }
}
ProjectItem.propTypes = {
  project: React.PropTypes.object.isRequired
};

class OldProject extends React.Component {
  render() {
    return (
      <li>
        <a href={`/project/${this.props.id}/progress`}>{this.props.name}</a>
      </li>
    );
  }
}
OldProject.propTypes = {
  id: React.PropTypes.oneOfType([
    React.PropTypes.number.isRequired,
    React.PropTypes.string.isRequired
  ]),
  name: React.PropTypes.string.isRequired
};

class OldProjectList extends React.Component {
  render() {
    let p; // eslint-disable-line init-declarations
    if (window.location.pathname !== '/') {
      const id = window.location.pathname.split('/')[2];
      p = this.props.projects.find((e) => e.active && e.id.toString() === id);
    }
    const active = window.location.pathname !== '/' && _.isUndefined(p);
    const className = active ? 'dropdown active' : 'dropdown';
    return (
      <li className={className}>
        <a
          href="javascript:void(0)"
          className="dropdown-toggle"
          data-toggle="dropdown"
          data-hover="dropdown"
        >
          Archived Projects <span className="caret"/>
        </a>
        <ul className="dropdown-menu">
          { this.props.projects.filter((e) => !e.active).map((project, i) => <OldProject key={i} id={project.id} name={project.name}/>) }
        </ul>
      </li>
    );
  }
}
OldProjectList.propTypes = {
  projects: React.PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
  return {
    projects: state.projects
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadProjects: (projects) => dispatch(loadProjects(projects))
  };
};

class Menu extends React.Component {
  constructor() {
    super();
    this.loadProjects = this.loadProjects.bind(this);
  }

  componentDidMount() {
    this.loadProjects();
    setInterval(this.loadProjects, pollInterval);
  }

  loadProjects() {
    $.ajax({
      url: projectsUrl,
      contentType: 'application/json; charset=utf-8'
    }).done((data) => {
      this.props.loadProjects(data.projects);
    }).fail((xhr, status, err) => {
      console.error(projectsUrl, status, err.toString()); // eslint-disable-line no-console
    }).always(() => {
      if (location.pathname === '/') {
        $('body').addClass('loaded');
      }
    });
  }

  render() {
    return (
      <div
        className="navbar navbar-default"
        role="navigation"
      >
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle"
            data-toggle="collapse"
            data-target=".navbar-responsive-collapse"
          >
            <span className="icon-bar"/>
            <span className="icon-bar"/>
            <span className="icon-bar"/>
          </button>
          <a className="navbar-brand" href="/">Varie-fied</a>
        </div>
        <div className="navbar-collapse collapse navbar-responsive-collapse">
          <ul className="nav navbar-nav">
            <HomeBar />
            { this.props.projects.map((project, index) => <ProjectItem key={index} project={project}/>) }
            <OldProjectList projects={this.props.projects}/>
            <li>
              <a
                href="javascript:void(0)"
                data-toggle="modal"
                data-target="#new-project-dialog"
              >
                <span className="fa fa-plus"/> New Project
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                data-toggle="modal"
                data-target="#new-variation-dialog"
              >
                <span className="fa fa-plus"/> New Variation
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);

