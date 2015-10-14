const React = require('react');
const $ = require('jquery');

class ProjectInfo extends React.Component {
  render() {
    if (this.props.project === null) {
      return false;
    }
    return (
      <h2>{this.props.prefix} of "{this.props.project.name}"
        <small>(<a href={this.props.alt_url}>{this.props.alt_text}</a>,
               Reference number: {this.props.project.reference_number};
               OH/Profit: {this.props.project.margin * 100}%;
          {this.props.project.admin_fee === null ? ' ' : ` Admin fee: ${this.props.project.admin_fee}`}
          <a
            href="javascript:void(0)"
            data-toggle="modal"
            data-target="#edit-dialog"
          >
            edit
          </a>)
        </small>
      </h2>
    );
  }
}

module.exports = ProjectInfo;
