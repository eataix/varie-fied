const React = require('react');

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
  constructor() {
    super();
    this.state = {
      projects: []
    };
    this.onProjectsChange = this.onProjectsChange.bind(this);
  }

  componentDidMount() {
    this.props.store.addChangeListener(this.props.changes.PROJECTS_LOADED, this.onProjectsChange);
  }

  onProjectsChange() {
    this.setState({
      projects: this.props.store.getProjects()
    });
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

module.exports = ProjectList
