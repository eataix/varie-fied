import React from 'react';
import { connect } from 'react-redux';
import { Input, Button, Modal } from 'react-bootstrap';

import { editClient, editSuperintendent, newProjectName, newProjectRefNumber, newProjectMargin, newProjectAdminFee } from './redux/actions';
import { newProjectUrl, newClientUrl, newSuperintendentUrl } from './defs';

class ProjectName extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.cb(this.refs.input.getValue());
  }

  render() {
    return (
      <Input
        ref="input"
        type="text"
        label="Project Name*"
        labelClassName="col-sm-3"
        wrapperClassName="col-sm-9"
        required
        onChange={this.handleChange}
        value={this.props.value}
      />
    );
  }
}
ProjectName.propTypes = {
  cb: React.PropTypes.func.isRequired,
  value: React.PropTypes.string.isRequired
};

class ReferenceNo extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.cb(this.refs.input.getValue());
  }

  render() {
    return (
      <Input
        ref="input"
        type="text"
        label="Reference Number*"
        labelClassName="col-sm-3"
        wrapperClassName="col-sm-9"
        required
        onChange={this.handleChange}
        value={this.props.value}
      />
    );
  }
}
ReferenceNo.propTypes = {
  cb: React.PropTypes.func.isRequired,
  value: React.PropTypes.string.isRequired
};

class Margin extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    const value = this.refs.input.getValue();
    if (value === '' || $.isNumeric(value)) {
      this.props.cb(value);
    }
  }

  render() {
    return (
      <Input
        ref="input"
        type="text"
        label="OH/Profit*"
        labelClassName="col-sm-3"
        wrapperClassName="col-sm-9"
        required
        data-parsley-type="number"
        onChange={this.handleChange}
        value={this.props.value}
        placeholder="e.g., please enter 0.1 for 10% OH"
      />
    );
  }
}
Margin.propTypes = {
  cb: React.PropTypes.func.isRequired,
  value: React.PropTypes.string.isRequired
};

class AdminFee extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    const value = this.refs.input.getValue();
    if (value === '' || $.isNumeric(value)) {
      this.props.cb(value);
    }
  }

  render() {
    return (
      <Input
        ref="input"
        type="text"
        label="Admin Fee"
        labelClassName="col-sm-3"
        wrapperClassName="col-sm-9"
        data-parsley-type="number"
        placeholder="leave blank if not applicable"
        onChange={this.handleChange}
        value={this.props.value}
      />
    );
  }
}
AdminFee.propTypes = {
  cb: React.PropTypes.func.isRequired,
  value: React.PropTypes.string.isRequired
};

class Client extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.editClient(this.refs.name.getValue(), this.refs.first.getValue(), this.refs.second.getValue());
  }

  render() {
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label">Client</label>
        <div className="col-sm-9">
          <table className="table table-bordered">
            <thead>
            <tr>
              <th>Client Name</th>
              <th>Address First Line</th>
              <th>Address Second Line</th>
            </tr>
            </thead>
            <tbody>
            <tr className="client">
              <td>
                <Input
                  ref="name"
                  standalone={true}
                  type="textarea"
                  required
                  value={this.props.client.name}
                  onChange={this.handleChange}
                />
              </td>
              <td style={{ verticalAlign: 'middle' }}>
                <Input
                  ref="first"
                  standalone={true}
                  type="text"
                  required
                  onChange={this.handleChange}
                  value={this.props.client.first}
                />
              </td>
              <td style={{ verticalAlign: 'middle' }}>
                <Input
                  ref="second"
                  standalone={true}
                  type="text"
                  required
                  onChange={this.handleChange}
                  value={this.props.client.second}
                />
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
Client.propTypes = {
  client: React.PropTypes.object.isRequired,
  editClient: React.PropTypes.func.isRequired
};


class Superintendent extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.editSuperintendent(this.refs.name.getValue(), this.refs.first.getValue(), this.refs.second.getValue());
  }

  render() {
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label">Superintendent</label>
        <div className="col-sm-9">
          <table className="table table-bordered">
            <thead>
            <tr>
              <th>Superintendent Name</th>
              <th>Address First Line</th>
              <th>Address Second Line</th>
            </tr>
            </thead>
            <tbody>
            <tr className="client">
              <td>
                <Input
                  ref="name"
                  standalone={true}
                  type="textarea"
                  required
                  value={this.props.superintendent.name}
                  onChange={this.handleChange}
                />
              </td>
              <td style={{ verticalAlign: 'middle' }}>
                <Input
                  ref="first"
                  standalone={true}
                  type="text"
                  required
                  onChange={this.handleChange}
                  value={this.props.superintendent.first}
                />
              </td>
              <td style={{ verticalAlign: 'middle' }}>
                <Input
                  ref="second"
                  standalone={true}
                  type="text"
                  required
                  onChange={this.handleChange}
                  value={this.props.superintendent.second}
                />
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
Superintendent.propTypes = {
  superintendent: React.PropTypes.object.isRequired,
  editSuperintendent: React.PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    name: state.newName,
    refNum: state.newRefNum,
    margin: state.newMargin,
    adminFee: state.newAdminFee,
    client: state.client,
    superintendent: state.superintendent
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editClient: (index, name, first, second) => {
      dispatch(editClient(index, name, first, second));
    },
    editSuperintendent: (index, name, first, second) => {
      dispatch(editSuperintendent(index, name, first, second));
    },
    newProjectName: (name) => {
      dispatch(newProjectName(name));
    },
    newProjectRefNumber: (name) => {
      dispatch(newProjectRefNumber(name));
    },
    newProjectMargin: (name) => {
      dispatch(newProjectMargin(name));
    },
    newProjectAdminFee: (name) => {
      dispatch(newProjectAdminFee(name));
    }
  };
};

class NewProjectForm extends React.Component {
  constructor() {
    super();
    this.handleSave = this.handleSave.bind(this);
    this.createClient = this.createClient.bind(this);
    this.createSuperintendent = this.createSuperintendent.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
  }

  handleHideModal() {
    $(this.refs.modal).modal('hide');
  }

  render() {
    return (
      <div
        id="new-project-dialog"
        ref="modal"
        className="modal fade"
        tabIndex={ -1 }
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <Modal.Header
              closeButton
              onHide={this.handleHideModal}
            >
              <Modal.Title>Add Project</Modal.Title>
            </Modal.Header>

            <div className="modal-body">
              <div className="container-fluid">
                <form
                  ref="form"
                  className="form-horizontal"
                  data-parsley-validate
                >
                  <ProjectName
                    value={this.props.name}
                    cb={this.props.newProjectName}
                  />
                  <ReferenceNo
                    value={this.props.refNum}
                    cb={this.props.newProjectRefNumber}
                  />
                  <Margin
                    value={this.props.margin}
                    cb={this.props.newProjectMargin}
                  />
                  <AdminFee
                    value={this.props.adminFee}
                    cb={this.props.newProjectAdminFee}
                  />
                  <Client
                    client={this.props.client}
                    editClient={this.props.editClient}
                  />
                  <Superintendent
                    superintendent={this.props.superintendent}
                    editSuperintendent={this.props.editSuperintendent}
                  />
                </form>
              </div>
            </div>
            <Modal.Footer>
              <p>* Required</p>
              <Button
                className="btn btn-primary btn-raised"
                data-dismiss="modal">Dismiss</Button>
              <Button
                className="btn btn-info btn-raised"
                onClick={this.handleSave}>Save</Button>
            </Modal.Footer>
          </div>
        </div>
      </div>
    );
  }

  createClient(data) {
    const client = this.props.client;
    console.log(client); // eslint-disable-line no-console

    const name = client.name;
    let first_line_address = client.first;
    if (first_line_address === '') {
      first_line_address = null;
    }
    let second_line_address = client.second;
    if (second_line_address === '') {
      second_line_address = null;
    }
    $.ajax({
      url: newClientUrl,
      type: 'POST',
      data: JSON.stringify({
        name,
        first_line_address,
        second_line_address,
        project_id: data.id
      }),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json'
    }).done(() => {
      this.createSuperintendent(data);
    }).fail(() => {
      swal({
        title: 'Error',
        text: 'Cannot save the project... Please try again.',
        type: 'error'
      });
    });
  }

  createSuperintendent(data) {
    const superintendent = this.props.superintendent;
    console.log(superintendent); // eslint-disable-line no-console

    const name = superintendent.name;
    let first_line_address = superintendent.first;
    if (first_line_address === '') {
      first_line_address = null;
    }
    let second_line_address = superintendent.second;
    if (second_line_address === '') {
      second_line_address = null;
    }
    $.ajax({
      url: newSuperintendentUrl,
      type: 'POST',
      data: JSON.stringify({
        name,
        first_line_address,
        second_line_address,
        project_id: data.id
      }),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json'
    }).done(() => {
      swal({
        title: 'Nice!',
        text: `You created a new project: ${data.name}`,
        type: 'success'
      }, () => {
        location.pathname = `/project/${data.id}/progress`;
      });
    }).fail(() => {
      swal({
        title: 'Error',
        text: 'Cannot save the project... Please try again.',
        type: 'error'
      });
    });
  }

  handleSave() {
    const instance = $(this.refs.form).parsley();
    instance.validate();
    if (!instance.isValid()) {
      return;
    }

    const project_name = this.props.name;
    const reference_number = this.props.refNum;
    let margin = this.props.margin;
    if (_.isString(margin)) {
      margin = parseFloat(margin);
    }
    let admin_fee = this.props.adminFee;
    if (admin_fee === '') {
      admin_fee = null;
    } else if (_.isString(admin_fee)) {
      admin_fee = parseFloat(admin_fee);
    }

    swal({
      title: 'Are you sure to add a project?',
      text: 'You can delete this project later if necessary!',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, add it!',
      cancelButtonText: 'No, cancel plx!',
      closeOnConfirm: false,
      closeOnCancel: false,
      customClass: 'newProjectConfirmation'
    }, (isConfirm) => {
      if (!isConfirm) {
        swal({
          title: 'Cancelled',
          text: 'The project is not yet added :)',
          type: 'error'
        });
        return;
      }

      const $button = $('.newProjectConfirmation').find('.confirm');
      const html = $button.html();
      $button.html(`<span class="fa fa-spinner fa-spin"></span> ${html}`);

      console.log({ // eslint-disable-line no-console
        url: newProjectUrl,
        type: 'POST',
        data: JSON.stringify({
          name: project_name,
          margin,
          reference_number,
          admin_fee
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
      });

      $.ajax({
        url: newProjectUrl,
        type: 'POST',
        data: JSON.stringify({
          name: project_name,
          margin,
          reference_number,
          admin_fee
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
      }).fail(() => {
        swal({
          title: 'Error',
          text: 'Cannot save the project... Please try again.',
          type: 'error'
        });
      }).done((data) => {
        this.createClient(data);
      });
    });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewProjectForm);

