import React from 'react';
import { connect } from 'react-redux';

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

class ProjectList extends React.Component {
  render() {
    return (
      <div>
        <h1>Active projects</h1>
        <ActiveProjectList projects={this.props.projects}/>
        <h1>Previous projects</h1>
        <InactiveProjectList projects={this.props.projects}/>
      </div>
    );
  }
}

export default connect(s=> {
  console.log(s);
  return {projects: s.projects}
})(ProjectList);
