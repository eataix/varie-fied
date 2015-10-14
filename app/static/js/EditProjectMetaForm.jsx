const Button = ReactBootstrap.Button;
const Input = ReactBootstrap.Input;
const Modal = ReactBootstrap.Modal;

const metaData = $('#project-data').data();
const projectRefNo = metaData.projectRefNo;
const projectName = metaData.projectName;
const projectMargin = parseFloat(metaData.projectMargin);
const projectAdminFee = $.isNumeric(metaData.projectAdminFee) ? parseFloat(metaData.projectAdminFee) : '';

class EditProjectMetaForm extends React.Component {
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
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
                <form className="form-horizontal" ref="form">
                  <Input
                    ref="name"
                    type="text"
                    label="Project Name"
                    labelClassName="col-sm-3"
                    wrapperClassName="col-sm-9"
                    placeholder="Name"
                    required
                    defaultValue={projectName}
                  />
                  <Input
                    ref="refNo"
                    type="text"
                    label="Reference Number"
                    labelClassName="col-sm-3"
                    wrapperClassName="col-sm-9"
                    placeholder="Reference Number"
                    required
                    defaultValue={projectRefNo}
                  />
                  <Input
                    ref="margin"
                    type="text"
                    label="OH/Profit"
                    labelClassName="col-sm-3"
                    wrapperClassName="col-sm-9"
                    placeholder=""
                    required
                    defaultValue={projectMargin}
                    data-parsley-type="number"
                  />
                  <Input
                    ref="adminFee"
                    type="text"
                    label="Fixed Administration Fee"
                    labelClassName="col-sm-3"
                    wrapperClassName="col-sm-9"
                    placeholder="(optional)"
                    defaultValue={projectAdminFee}
                    data-parsley-type="number"
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
    $(this.refs.modal.getDOMNode()).modal('hide');
  }

  onClick() {
    const instance = $(this.refs.form.getDOMNode()).parsley();
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
      $(this.refs.modal.getDOMNode()).modal('hide'))
             );
    });
  }
}

module.exports =  EditProjectMetaForm;
