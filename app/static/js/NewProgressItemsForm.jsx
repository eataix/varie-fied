const React = require('react');

const ReactBootstrap = require('react-bootstrap');
const Input = ReactBootstrap.Input;
const Button = ReactBootstrap.Button;
const Modal = ReactBootstrap.Modal;

class ProgressItem extends React.Component {
  handleChange() {
    this.props.updateItem(this.refs.name.getDOMNode().value, this.refs.value.getDOMNode().value);
  }

  render() {
    return (
      <tr>
        <td>
          <Input
            standalone={true}
            type="textarea"
            required
            ref="name"
            value={this.props.name}
            onChange={this.handleChange}
          />
        </td>
        <td style={{verticalAlign: 'middle'}}>
          <Input
            standalone={true}
            type="text"
            required
            data-parsley-type="number"
            ref="value"
            value={this.props.value}
            onChange={this.handleChange}
          />
        </td>
        <td style={{width: 150, textAlign: 'center', verticalAlign: 'middle'}}>
          <a
            href="javascript:void(0)"
            onClick={this.props.addRow}
          >
            <span className="fa fa-plus"> </span> Add
          </a>
          /
          <a
            href="javascript:void(0)"
            onClick={this.props.deleteRow}
          >
            <span className="fa fa-minus"> </span> Delete
          </a>
        </td>
      </tr>
    );
  }
}

class NewProgressItemsForm extends React.Component {
  constructor() {
    super();
    this.state = {
      list: []
    };
    this.onListChange = this.onListChange.bind(this);
    this.handleHideModal = this.handleHideModal.bind(this);
  }

  addRow() {
    this.props.actions.addItem({
      name: '',
      value: {
        amount: ''
      }
    })
  }

  deleteRow(index) {
    this.props.actions.removeItem(index);
  }

  updateItem(index, name, value) {
    this.props.actions.updateItem(index, {name: name, value: {amount: value === '' ? '' : parseFloat(value)}});
  }

  componentDidMount() {
    this.props.store.addChangeListener(this.props.changes.ITEMS_CHANGE, this.onListChange);
  }

  componentWillUnmount() {
    this.props.store.removeChangeListener(this.props.changes.ITEMS_CHANGE, this.onListChange);
  }

  onListChange() {
    this.setState({list: this.props.store.getList()});
  }

  handleHideModal() {
    $(this.refs.modal.getDOMNode()).modal('hide');
  }

  render() {
    return (
      <div
        className="modal fade"
        ref="modal"
        tabIndex={-1}
        id="new-progress-item-dialog"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <Modal.Header
              closeButton
              onHide={this.handleHideModal}
            >
              <Modal.Title>New Progress Items</Modal.Title>
            </Modal.Header>
            <div className="modal-body">
              <div className="container-fluid">
                <form className="form-horizontal"
                      ref="form">
                  <div className="form-group">
                    <table className="table table-bordered">
                      <thead>
                      <tr>
                        <th style={{textAlign: 'center'}}>Name</th>
                        <th style={{textAlign: 'center'}}>Contract Value</th>
                        <th style={{textAlign: 'center'}}/>
                      </tr>
                      </thead>
                      <tbody>
                      {this.state.list.map((r, index) =>
                      <ProgressItem
                        key={r+index}
                        addRow={this.addRow}
                        deleteRow={this.deleteRow.bind(null, index)}
                        name={r.name}
                        value={r.value.amount}
                        updateItem={this.updateItem.bind(null, index)}
                      />)}
                      </tbody>
                    </table>
                  </div>
                </form>
              </div>
            </div>
            <Modal.Footer>
              <Button
                className="btn btn-primary btn-raised"
                data-dismiss="modal"
              >
                Dismiss
              </Button>
              <Button
                className="btn btn-info btn-raised"
                onClick={this.submit}
              >
                Save
              </Button>
            </Modal.Footer>
          </div>
        </div>
      </div>
    );
  }

  submit() {
    const instance = $(this.refs.form.getDOMNode()).parsley();
    instance.validate();
    if (!instance.isValid()) {
      return;
    }

    swal({
      title: 'Are you sure to add these?',
      text: 'You can edit them later!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'teal',
      confirmButtonText: 'Yes, add them!',
      cancelButtonText: 'No, cancel plx!',
      closeOnConfirm: false,
      closeOnCancel: false,
      customClass: 'deleteRowsConfirmation'
    }, isConfirmed => {
      if (!isConfirmed) {
        swal({
          title: 'Cancelled',
          text: 'They are not yet added :)',
          type: 'error'
        });
        return;
      }

      const progressItems = this.props.store.getList();
      console.log(progressItems);

      const statusArray = new Array(progressItems.length).fill(null);

      (function createItem(offset) {
        if (offset >= progressItems.length) {
          return;
        }
        const item = progressItems[offset];
        const name = item.name;
        const contract_value = item.value.amount;

        $.ajax({
            url: newProgressItemUrl,
            type: 'POST',
            data: JSON.stringify({
              name: name,
              contract_value: contract_value,
              project_id: projectId
            }),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
          })
          .done(() => {
            statusArray[offset] = true;
            createItem(offset + 1);
          })
          .fail(() => statusArray[offset] = false);
      })(0);

      (function waiting() {
        if (statusArray.some(isFalse)) {
          swal({
            title: 'Error',
            text: 'Failed to save some this.props.changes.',
            type: 'error'
          });
          console.log('error');
        } else if (statusArray.some(isNull)) {
          setTimeout(waiting, 100);
        } else if (statusArray.every(isTrue)) {
          swal({
            title: 'Nice!',
            text: 'You added all changes',
            type: 'success'
          }, () => location.reload());
        }
      })();
    });
  }
}

module.exports = NewProgressItemsForm;
