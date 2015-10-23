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
    this.props.cb(this.refs.name.getValue());
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
ProjectName.propTypes = {
  cb: React.PropTypes.func.isRequired,
  name: React.PropTypes.string.isRequired
};

class ReferenceNumber extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.cb(this.refs.refNo.getValue());
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
ReferenceNumber.propTypes = {
  cb: React.PropTypes.func.isRequired,
  reference_number: React.PropTypes.string.isRequired
};

class Margin extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    const value = this.refs.margin.getValue();
    if (isFinite(value)) {
      this.props.cb(value);
    }
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
Margin.propTypes = {
  cb: React.PropTypes.func.isRequired,
  margin: React.PropTypes.number.isRequired
};

class AdminFee extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    const value = this.refs.adminFee.getValue();
    if (isFinite(value)) {
      this.props.cb(value);
    }
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
AdminFee.propTypes = {
  cb: React.PropTypes.func.isRequired,
  admin_fee: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]).isRequired
};

const mapStateToProps = (state) => {
  return {
    name: state.editName,
    reference_number: state.editRefNum,
    margin: state.editMargin,
    admin_fee: state.editAdminFee
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    editProjectName: (value) => dispatch(editProjectName(value)),
    editProjectRefNumber: (value) => dispatch(editProjectRefNumber(value)),
    editProjectMargin: (value) => {
      if (_.isString(value)) {
        value = parseFloat(value);
      }
      dispatch(editProjectMargin(value));
    },
    editProjectAdminFee: (value) => {
      if (_.isString(value)) {
        value = parseFloat(value);
      }
      dispatch(editProjectAdminFee(value));
    }
  };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class EditProjectMetaForm extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
  }

  render() {
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
                    name={this.props.name}
                    cb={this.props.editProjectName}
                  />
                  <ReferenceNumber
                    reference_number={this.props.reference_number}
                    cb={this.props.editProjectRefNumber}
                  />
                  <Margin
                    margin={this.props.margin}
                    cb={this.props.editProjectMargin}
                  />
                  <AdminFee
                    admin_fee={this.props.admin_fee}
                    cb={this.props.editProjectAdminFee}
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
                onClick={this.handleClick}>
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

  handleClick() {
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

      const new_name = this.props.name;
      const new_margin = this.props.margin;
      const new_reference_number = this.props.reference_number;
      let new_admin_fee = this.props.admin_fee;
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
      }).done(() => {
        swal({
          title: 'Nice!',
          text: 'Save changes',
          type: 'success'
        }, () => {
          this.handleHideModal();
        });
      });
    });
  }
}


