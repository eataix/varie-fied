'use strict';

class Toolbar extends React.Component {
  render() {
    let mid;
    if (this.props.alt_text != 'Progress') {
      mid = (
        <button className="btn btn-material-deep-purple btn-raised" data-toggle="modal" data-target="#new-progress-item-dialog">
          <i className="fa fa-plus"></i> New Items
        </button>
      );
    } else {
      mid = (
        <button className="btn btn-primary btn-raised" data-toggle="modal" data-target="#new-variation-dialog">
          <i className="fa fa-plus"></i> Add Variation
        </button>
      );
    }
    return (
      <div className="btn-toolbar" role="toolbar" aria-label="...">
        <a className="btn btn-info btn-raised" href="/export/{{ current_project.pid }}">
          <i className="fa fa-download"></i> Export Project
        </a>
        <button id="archive_project" type="button" className="btn btn-info btn-raised">
          <i className="fa fa-check-square-o"></i>
          { this.props.active ? 'Archive Project' : 'Unarchive Project' }
        </button>
        <button id="delete_project" type="button" className="btn btn-danger btn-raised">
          <i className="fa fa-trash"></i> Delete Project
        </button>
      </div>
    );
  }
}

module.exports = Toolbar;
