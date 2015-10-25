import React from 'react';
import { connect } from 'react-redux';
import ReactBootstrap from 'react-bootstrap';
import { Input, Button, Modal } from 'react-bootstrap';

import { addClient, deleteClient, editClient, newProjectName, newProjectRefNumber, newProjectMargin, newProjectAdminFee } from './redux/actions';
import { isTrue, isFalse, isNull, newProjectUrl, newClientUrl } from './defs';

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
        label="Admin Fee*"
        labelClassName="col-sm-3"
        wrapperClassName="col-sm-9"
        data-parsley-type="number"
        placeholder="optional"
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

class ClientList extends React.Component {
  render() {
    return (
      <div className="form-group">
        <label className="col-sm-3 control-label">Clients</label>
        <div className="col-sm-9">
          <table className="table table-bordered">
            <thead>
            <tr>
              <th style={{textAlign: 'center'}}>Client Name</th>
              <th style={{textAlign: 'center'}}>Address First Line</th>
              <th style={{textAlign: 'center'}}>Address Second Line</th>
              <th style={{textAlign: 'center'}}/>
            </tr>
            </thead>
            <tbody>
            {
              this.props.clients.map((r, i) =>
              <Client
                key={r + i}
                addRow={this.props.addClient}
                deleteRow={this.props.deleteClient.bind(null, i)}
                updateItem={this.props.editClient.bind(null, i)}
                name={r.name}
                first={r.first}
                second={r.second}
              />)
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
ClientList.propTypes = {
  addClient: React.PropTypes.func.isRequired,
  deleteClient: React.PropTypes.func.isRequired,
  editClient: React.PropTypes.func.isRequired,
  clients: React.PropTypes.object.isRequired
};

class Client extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.updateItem(this.refs.name.getValue(), this.refs.first.getValue(), this.refs.second.getValue());
  }

  render() {
    return (
      <tr className="client">
        <td>
          <Input
            ref="name"
            standalone={true}
            type="textarea"
            required
            value={this.props.name}
            onChange={this.handleChange}
          />
        </td>
        <td style={{verticalAlign: 'middle'}}>
          <Input
            ref="first"
            standalone={true}
            type="text"
            required
            onChange={this.handleChange}
            value={this.props.first}
          />
        </td>
        <td style={{verticalAlign: 'middle'}}>
          <Input
            ref="second"
            standalone={true}
            type="text"
            required
            onChange={this.handleChange}
            value={this.props.second}
          />
        </td>
        <td style={{width: 80, textAlign: 'center', verticalAlign: 'middle'}}>
          <a
            href="javascript:void(0)"
            onClick={this.props.addRow}
          >
            <i className="fa fa-plus"/>
          </a>
          /
          <a
            href="javascript:void(0)"
            onClick={this.props.deleteRow}
          >
            <i className="fa fa-minus"/>
          </a>
        </td>
      </tr>
    );
  }
}
Client.propTypes = {
  addRow: React.PropTypes.func.isRequired,
  deleteRow: React.PropTypes.func.isRequired,
  updateItem: React.PropTypes.func.isRequired,
  name: React.PropTypes.string.isRequired,
  first: React.PropTypes.string.isRequired,
  second: React.PropTypes.string.isRequired
};

const mapStateToProps = (state) => {
  return {
    name: state.newName,
    refNum: state.newRefNum,
    margin: state.newMargin,
    adminFee: state.newAdminFee,
    clients: state.clients
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addClient: () => {
      dispatch(addClient('', '', ''));
    },
    deleteClient: (index) => {
      dispatch(deleteClient(index));
    },
    editClient: (index, name, first, second) => {
      dispatch(editClient(index, name, first, second));
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

@connect(mapStateToProps, mapDispatchToProps)
export default class NewProjectForm extends React.Component {
  constructor() {
    super();
    this.handleSave = this.handleSave.bind(this);
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
        tabIndex={-1}
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
                  <ClientList
                    clients={this.props.clients}
                    addClient={this.props.addClient}
                    deleteClient={this.props.deleteClient}
                    editClient={this.props.editClient}
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
    }, isConfirm => {
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
      $button.html('<i class="fa fa-spinner fa-spin"></i> ' + html);

      console.log({
        url: newProjectUrl,
        type: 'POST',
        data: JSON.stringify({
          name: project_name,
          margin: margin,
          reference_number: reference_number,
          admin_fee: admin_fee
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
      });

      $.ajax({
          url: newProjectUrl,
          type: 'POST',
          data: JSON.stringify({
            name: project_name,
            margin: margin,
            reference_number: reference_number,
            admin_fee: admin_fee
          }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json'
        })
        .fail(() => {
          swal({
            title: 'Error',
            text: 'Cannot save the project... Please try again.',
            type: 'error'
          });
        })
        .done((data) => {
          const clients = this.props.clients;
          console.log(clients);
          const statusArray = new Array(clients.size).fill(null);

          (() => {
            const createClient = (offset = 0) => {
              if (offset >= clients.size) {
                return;
              }
              const client = clients.get(offset);
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
                    name: name,
                    first_line_address: first_line_address,
                    second_line_address: second_line_address,
                    project_id: data.id
                  }),
                  contentType: 'application/json; charset=utf-8',
                  dataType: 'json'
                })
                .done(() => {
                  statusArray[offset] = true;
                  createClient(offset + 1);
                })
                .fail(() => statusArray[offset] = false);
            };
            createClient(0);
          })();

          (() => {
            const waiting = () => {
              if (statusArray.some(isFalse)) {
                swal({
                  title: 'Error',
                  text: 'Cannot save the project... Please try again.',
                  type: 'error'
                });
              } else if (statusArray.some(isNull)) {
                setTimeout(waiting, 100);
              } else if (statusArray.every(isTrue)) {
                swal({
                  title: 'Nice!',
                  text: `You created a new project: ${data.name}`,
                  type: 'success'
                }, () => {
                  $(this.refs.modal).modal('hide');
                });
              }
            };
            waiting();
          })();
        });
    });
  }
}

