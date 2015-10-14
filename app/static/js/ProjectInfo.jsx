'use strict';

class ProjectInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      reference_number: '',
      active: true,
      margin: 0.0,
      admin_fee: null
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
    .done(function(data) {
      this.setState({
        name: data.name,
        reference_number: data.reference_number,
        active: data.active,
        margin: data.margin,
        admin_fee: data.admin_fee
      });
    }.bind(this))
    .fail(function(xhr, status, err) {
      console.error(this.props.project_url, status, err.toString());
    }.bind(this));
  }

  render() {
    return (
      <h2>{this.props.prefix} of "{this.state.name}"
        <small>(<a href={this.props.alt_url}>{this.props.alt_text}</a>,
          Reference number: {this.state.reference_number};
          OH/Profit: {this.state.margin * 100}%;
          {this.state.admin_fee === null ? ' ' : ` Admin fee: ${this.state.admin_fee}`}
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
