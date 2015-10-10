(() => {
  'use strict';

  const ProjectInfo = React.createClass({
    getInitialState: function() {
      return {
        name: '',
        reference_number: '',
        active: true,
        margin: 0.0,
        admin_fee: null
      };
    },
    componentDidMount: function() {
      this.loadProjects();
      setInterval(this.loadProjects, this.props.pollInterval);
    },
    loadProjects: function() {
      $.ajax({
            url: this.props.project_url,
            dataType: 'json',
            contentType: 'application/json; charset=utf-8'
          })
          .success(function(data) {
            console.log(data);
            console.log(data);
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
    },
    render: function() {
      return (
          <h2>{this.props.prefix} "{this.state.name}"
            <small>(<a href={this.props.alt_url}>{this.props.alt_text}</a>,
                   Reference number: {this.state.reference_number};
                   OH/Profit: {this.state.margin * 100}%
              {this.state.admin_fee === null ? '' : 'Admin fee: ' + this.state.admin_fee}
              <a href="javascript:void(0)" data-toggle="modal" data-target="#edit-dialog"> edit</a>)
            </small>
          </h2>
      );
    }
  });

  const project_url = $('#project-data').data().editProjectUrl;
  const prefix = window.location.pathname.split('/')[3] === 'progress' ? 'Progress' : 'Variations';
  const alt_url = prefix === 'Progress' ? './variation' : './progress';
  const alt_text = prefix === 'Progress' ? 'Variations' : 'Progress';
  ReactDOM.render(
      <ProjectInfo project_url={project_url} pollInterval={2000} prefix={prefix} alt_url={alt_url} alt_text={alt_text}/>,
      document.getElementById('project-info')
  );
})();