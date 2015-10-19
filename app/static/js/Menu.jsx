import React from 'react';
import { loadProjects } from './redux/actions';
import { connect } from 'react-redux';
import { NavItem } from 'react-bootstrap';

const project_url = $('#meta-data').data().projectsUrl;

class HomeBar extends React.Component {
  render() {
    const active = window.location.pathname === '/';
    return (
      <NavItem
        active={active}
        href="/"
      >
        <i className="fa fa-home"/> Home
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
    const className = active ? "dropdown active" : "dropdown";
    const iClassName = active ? "fa fa-folder-open" : "fa fa-folder";
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
          <i className={iClassName}/> {this.props.project.name}<span className="caret"/>
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
    return (
      <li>
        <a href={`/project/${this.props.id}/progress`}>{this.props.name}</a>
      </li>
    );
  }
}

class OldProjectList extends React.Component {
  render() {
    let p = undefined;
    if (window.location.pathname !== '/') {
      const id = window.location.pathname.split('/')[2];
      p = this.props.projects.find((e) => e.active && e.id.toString() === id);
    }
    const active = window.location.pathname !== '/' && p === undefined;
    const className = active ? "dropdown active" : "dropdown";
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
          { this.props.projects.filter(e => !e.active).map((p, i) => <OldProject key={i} id={p.id} name={p.name}/>) }
        </ul>
      </li>
    );
  }
}

class Menu extends React.Component {
  constructor() {
    super();
    this.loadProjects = this.loadProjects.bind(this);
  }

  componentDidMount() {
    this.loadProjects();
    setInterval(this.loadProjects, 10000);
    $('body').addClass('loaded');
  }

  loadProjects() {
    $.ajax({
        url: project_url,
        contentType: 'application/json; charset=utf-8'
      })
      .done(data=> this.props.dispatch(loadProjects(data.projects)))
      .fail(((xhr, status, err) => console.error(project_url, status, err.toString())).bind(this));
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
            { this.props.projects.map((p, i) => <ProjectItem key={i} project={p}/>) }
            <OldProjectList projects={this.props.projects}/>
            <li>
              <a
                href="javascript:void(0)"
                data-toggle="modal"
                data-target="#new-project-dialog"
              >
                <i className="fa fa-plus"/> New Project
              </a>
            </li>
            <li>
              <a
                href="javascript:void(0)"
                data-toggle="modal"
                data-target="#new-variation-dialog"
              >
                <i className="fa fa-plus"/> New Variation
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default connect(s=> {
  return {projects: s.projects}
})(Menu);
