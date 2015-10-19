import React from 'react';
import { connect } from 'react-redux';
import { Button, Input, Modal } from 'react-bootstrap';
import { editProjectName, editProjectRefNumber, editProjectMargin, editProjectAdminFee } from './redux/actions';

class ProjectName extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.dispatch(editProjectName(event.target.value));
  }

  render() {
    return (
      <Input
        ref="name"
        type="text"
        label="Project Name"
        labelClassName="col-sm-3"
        wrapperClassName="col-sm-9"
        placeholder="Name"
        required
        value={this.props.name}
        onChange={this.handleChange}
      />
    );
  }
}

class ReferenceNumber extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.dispatch(editProjectName(event.target.value));
  }

  render() {
    return (
      <Input
        ref="refNo"
        type="text"
        label="Reference Number"
        labelClassName="col-sm-3"
        wrapperClassName="col-sm-9"
        placeholder="Reference Number"
        required
        value={this.props.reference_number}
        onChange={this.handleChange}
      />
    );
  }
}

class Margin extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.dispatch(editProjectName(event.target.value));
  }

  render() {
    return (
      <Input
        ref="margin"
        type="text"
        label="OH/Profit"
        labelClassName="col-sm-3"
        wrapperClassName="col-sm-9"
        placeholder=""
        required
        value={this.props.margin}
        data-parsley-type="number"
        onChange={this.handleChange}
      />
    );
  }
}

class AdminFee extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.dispatch(editProjectName(event.target.value));
  }

  render() {
    return (
      <Input
        ref="adminFee"
        type="text"
        label="Fixed Administration Fee"
        labelClassName="col-sm-3"
        wrapperClassName="col-sm-9"
        placeholder="(optional)"
        value={this.props.admin_fee}
        data-parsley-type="number"
        onChange={this.handleChange}
      />
    );
  }
}

class EditProjectMetaForm extends React.Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
  }

  render() {
    if (this.props.project === null) {
      return false;
    }
    return (
      <div
        id="edit-dialog"
        ref="modal"
        className="modal fade"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <Modal.Header
              closeButton
              onHide={this.handleHideModal}
            >
              <Modal.Title>Edit Project</Modal.Title>
            </Modal.Header>
            <div className="modal-body">
              <div className="container-fluid">
                <form
                  className="form-horizontal"
                  ref="form"
                >
                  <ProjectName
                    dispatch={this.props.dispatch}
                    name={this.props.name}
                  />
                  <ReferenceNumber
                    dispatch={this.props.dispatch}
                    reference_number={this.props.reference_number}
                  />
                  <Margin
                    dispatch={this.props.dispatch}
                    margin={this.props.margin}
                  />
                  <AdminFee
                    dispatch={this.props.dispatch}
                    admin_fee={this.props.admin_fee}
                  />
                </form>
              </div>
            </div>
            <Modal.Footer>
              <Button
                className="btn btn-primary btn-raised"
                data-dismiss="modal">
                Dismiss
              </Button>
              <Button
                className="btn btn-info btn-raised"
                onClick={this.onClick}>
                Save
              </Button>
            </Modal.Footer>
          </div>
        </div>
      </div>
    );
  }

  handleHideModal() {
    $(this.refs.modal).modal('hide');
  }

  onClick() {
    const instance = $(this.refs.form).parsley();
    instance.validate();
    if (!instance.isValid()) {
      return;
    }

    swal({
      title: 'Are you sure to save the changes?',
      text: 'You cannot recover them later!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'teal',
      confirmButtonText: 'Yes, save them!',
      cancelButtonText: 'No, cancel plx!',
      closeOnConfirm: false,
      closeOnCancel: false,
      customClass: 'saveMetaConfirmation'
    }, isConfirmed => {
      if (!isConfirmed) {
        swal({
          title: 'Cancelled',
          text: 'Your project is safe :)',
          type: 'error'
        });
        return;
      }
      const $button = $('.saveMetaConfirmation').find('.confirm');
      const html = $button.html();
      $button.html('<i class="fa fa-spinner fa-spin"></i> ' + html);

      const new_name = this.refs.name.getValue();
      const new_margin = this.refs.margin.getValue();
      const new_reference_number = this.refs.refNo.getValue();
      let new_admin_fee = this.refs.adminFee.getValue();
      if (new_admin_fee === '') {
        new_admin_fee = null;
      }

      const editProjectUrl = $('#project-data').data().editProjectUrl;

      console.log({
        url: editProjectUrl,
        type: 'PUT',
        data: JSON.stringify({
          name: new_name,
          margin: new_margin,
          admin_fee: new_admin_fee,
          reference_number: new_reference_number
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
      });

      $.ajax({
        url: editProjectUrl,
        type: 'PUT',
        data: JSON.stringify({
          name: new_name,
          margin: new_margin,
          admin_fee: new_admin_fee,
          reference_number: new_reference_number
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
      }).done(() =>
        swal({
          title: 'Nice!',
          text: 'Save changes',
          type: 'success'
        }, () =>
          $(this.refs.modal).modal('hide'))
      );
    });
  }
}

const selector = function(state) {
  if (state.project === null) {
    return {};
  }
  return {
    project: state.project,
    name: state.editName !== '' ? state.editName : state.project.name,
    reference_number: state.editRefNum !== '' ? state.editRefNum : state.project.reference_number,
    margin: state.editMargin !== '' ? state.editMargin : state.project.margin,
    admin_fee: state.editAdminFee !== '' ? state.editAdminFee : state.project.admin_fee
  };
};
export default connect(selector)(EditProjectMetaForm);
