import React from 'react';
import { connect } from 'react-redux';

class ProjectItem extends React.Component {
  render() {
    return (
      <li>
        <a href={`project/${this.props.id}/progress`} style={{ fontSize: '1.3em' }}>
          {this.props.name}
        </a>
      </li>
    );
  }
}
ProjectItem.propTypes = {
  id: React.PropTypes.number.isRequired,
  name: React.PropTypes.string.isRequired
};

class ActiveProjectList extends React.Component {
  render() {
    return (
      <div>
        <ul>
          { this.props.projects.filter((p) => p.active).map((p, i) => <ProjectItem key={i} id={p.id} name={p.name}/>) }
        </ul>
      </div>
    );
  }
}
ActiveProjectList.propTypes = {
  projects: React.PropTypes.array.isRequired
};

class InactiveProjectList extends React.Component {
  render() {
    return (
      <div>
        <ul>
          { this.props.projects.filter((p) => !p.active).map((p, i) => <ProjectItem key={i} id={p.id} name={p.name}/>) }
        </ul>
      </div>
    );
  }
}
InactiveProjectList.propTypes = {
  projects: React.PropTypes.array.isRequired
};

const mapStateToProps = (state) => {
  return {
    projects: state.projects
  };
};

const mapDispatchToProps = () => {
  return {};
};

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

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);

