import React from 'react';

class ProjectInfo extends React.Component {
  render() {
    if (_.isNull(this.props.project)) {
      return false;
    }
    return (
      <h2>{this.props.prefix} of "{this.props.project.name}"
        <small>
          (
          <a href={this.props.alt_url}>{this.props.alt_text}</a>;
          Reference number: {this.props.project.reference_number};
          OH/Profit: {this.props.project.margin * 100.0}%;
          { _.isNull(this.props.project.admin_fee) ? ' ' : ` Admin fee: ${this.props.project.admin_fee}; ` }
          <a
            href="javascript:void(0)"
            data-toggle="modal"
            data-target="#edit-dialog"
          >
            edit
          </a>
          )
        </small>
      </h2>
    );
  }
}

ProjectInfo.propTypes = {
  project: React.PropTypes.object,
  prefix: React.PropTypes.string.isRequired,
  alt_url: React.PropTypes.string.isRequired,
  alt_text: React.PropTypes.string.isRequired
};

export default ProjectInfo;

