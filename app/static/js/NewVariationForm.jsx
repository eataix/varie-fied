import React from 'react';
import { connect } from 'react-redux';
import { Input, Button, Modal } from 'react-bootstrap';
import { updateTime, updateSubcontractor, updateInvoiceNumber, updateMarginAndAdminFee, updateDescription, updatePreparedFor, addVariationItem, deleteVariationItem, editVariationItem } from './redux/actions';
import { isTrue, isFalse, isNull, newVariationUrl, newItemUrl } from './defs';
import { spinInterval } from './config';

class TimePicker extends React.Component {
  componentDidMount() {
    $(this.refs.picker).datetimepicker({
      showTodayButton: true
    }).on('dp.change', (e) => {
      this.props.cb(e.date.utc().format());
    });
  }

  render() {
    return (
      <div className="form-group">
        <label
          htmlFor="inputTime"
          className="col-sm-2 control-label"
        >
          Time*
        </label>
        <div className="col-sm-10">
          <div
            className="input-group date"
            ref="picker"
          >
            <input
              type="text"
              className="form-control"
              required
            />
            <span className="input-group-addon">
              <span className="fa fa-calendar"/>
            </span>
          </div>
        </div>
      </div>
    );
  }
}
TimePicker.propTypes = {
  cb: React.PropTypes.func.isRequired
};

class Subcontractor extends React.Component {
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
        label="Subcontractor*"
        labelClassName="col-sm-2"
        wrapperClassName="col-sm-10"
        required
        onChange={this.handleChange}
        value={this.props.subcontractor}
      />
    );
  }
}
Subcontractor.propTypes = {
  cb: React.PropTypes.func.isRequired,
  subcontractor: React.PropTypes.string.isRequired
};

class InvoiceNo extends React.Component {
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
        label="Invoice Number"
        labelClassName="col-sm-2"
        wrapperClassName="col-sm-10"
        placeholder="Optional"
        onChange={this.handleChange}
        value={this.props.invoiceNo}
      />
    );
  }
}
InvoiceNo.propTypes = {
  cb: React.PropTypes.func.isRequired,
  invoiceNo: React.PropTypes.string.isRequired
};

class ValueOfWork extends React.Component {
  render() {
    let total = 0.0;
    this.props.items.forEach((item) => {
      let value = item.value;
      if (_.isString(value)) {
        value = parseFloat(value);
      }
      total += value;
    });
    return (
      <Input
        type="text"
        label="Value of Work"
        labelClassName="col-sm-2"
        wrapperClassName="col-sm-10"
        value={accounting.formatMoney(total)}
        placeholder={0.0}
        disabled
      />
    );
  }
}
ValueOfWork.propTypes = {
  items: React.PropTypes.object.isRequired
};

class Project extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const p = this.props.projects.find((e) => e.id.toString() === event.target.value);
    this.props.cb(p.id, p.margin, p.admin_fee);
  }

  render() {
    return (
      <div className="form-group">
        <label className="col-sm-2 control-label">Project*</label>
        <div className="col-sm-10">
          <select
            className="form-control"
            onChange={this.handleChange}
            ref="select"
          >
            <option value="-1">Select a project</option>
            {this.props.projects.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
          </select>
        </div>
      </div>
    );
  }
}
Project.propTypes = {
  projects: React.PropTypes.array.isRequired,
  cb: React.PropTypes.func.isRequired
};

class Margin extends React.Component {
  render() {
    const value = `${accounting.formatNumber(this.props.value * 100.0)} %`;
    return (
      <Input
        type="text"
        label="OH/Profit"
        labelClassName="col-sm-2"
        wrapperClassName="col-sm-10"
        value={value}
        placeholder={0.0}
        disabled
      />
    );
  }
}
Margin.propTypes = {
  value: React.PropTypes.number.isRequired
};

class AdminFee extends React.Component {
  render() {
    const value = this.props.value;
    if (_.isNull(value) || _.isString(value)) {
      return false;
    }
    return (
      <Input
        type="text"
        label="Admin Fee"
        labelClassName="col-sm-2"
        wrapperClassName="col-sm-10"
        value={accounting.formatMoney(value)}
        placeholder={0.0}
        disabled
      />
    );
  }
}
AdminFee.propTypes = {
  value: React.PropTypes.number
};

class Subtotal extends React.Component {
  render() {
    let valueOfWork = 0.0;
    this.props.items.forEach((item) => {
      valueOfWork += parseFloat(item.value);
    });
    const subtotal = valueOfWork * (1.0 + this.props.margin) + (_.isNull(this.props.adminFee) ? 0 : this.props.adminFee);
    return (
      <Input
        type="text"
        label="Subtotal"
        labelClassName="col-sm-2"
        wrapperClassName="col-sm-10"
        value={accounting.formatMoney(subtotal)}
        placeholder={0.0}
        disabled
      />
    );
  }
}
Subtotal.propTypes = {
  items: React.PropTypes.object.isRequired,
  margin: React.PropTypes.number.isRequired,
  adminFee: React.PropTypes.number
};

class Description extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.cb(this.refs.input.getValue());
  }

  render() {
    if (this.props.items.size === 1) {
      return false;
    }
    return (
      <Input
        ref="input"
        type="textarea"
        label="Description"
        labelClassName="col-sm-2"
        wrapperClassName="col-sm-10"
        rows={ 5 }
        onChange={this.handleChange}
      />
    );
  }
}
Description.propTypes = {
  items: React.PropTypes.object.isRequired,
  cb: React.PropTypes.func.isRequired
};

class PreparedFor extends React.Component {
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
        label="Prepared for"
        labelClassName="col-sm-2"
        wrapperClassName="col-sm-10"
        rows={ 5 }
        onChange={this.handleChange}
        value={this.props.preparedFor}
      />
    );
  }
}
PreparedFor.propTypes = {
  preparedFor: React.PropTypes.string.isRequired,
  cb: React.PropTypes.func.isRequired
};

class VariationItem extends React.Component {
  constructor() {
    super();
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
  }

  handleNameChange() {
    const name = this.refs.name.getValue();
    const value = this.refs.value.getValue();
    this.props.updateItem(name, value);
  }

  handleValueChange() {
    const name = this.refs.name.getValue();
    const value = this.refs.value.getValue();
    if (value === '' || $.isNumeric(value)) {
      this.props.updateItem(name, value);
    }
  }

  render() {
    return (
      <tr className="variationItem">
        <td>
          <Input
            standalone={true}
            type="textarea"
            ref="name"
            required
            value={this.props.name}
            onChange={this.handleNameChange}
          />
        </td>
        <td style={{ verticalAlign: 'middle' }}>
          <Input
            standalone={true}
            type="text"
            ref="value"
            required
            data-parsley-type="number"
            onChange={this.handleValueChange}
            value={this.props.value}
          />
        </td>
        <td style={{ width: 120, textAlign: 'center', verticalAlign: 'middle' }}>
          <a
            href="javascript:void(0)"
            className="add-row"
            onClick={this.props.addRow}
          >
            <span className="fa fa-plus"/> Add
          </a>
          /
          <a
            href="javascript:void(0)"
            className="delete-row"
            onClick={this.props.deleteRow}
          >
            <span className="fa fa-minus"/> Delete
          </a>
        </td>
      </tr>
    );
  }
}
VariationItem.propTypes = {
  addRow: React.PropTypes.func.isRequired,
  deleteRow: React.PropTypes.func.isRequired,
  updateItem: React.PropTypes.func.isRequired,
  name: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired
};

class ItemTable extends React.Component {
  render() {
    return (
      <div className="form-group">
        <label
          htmlFor="inputDescription"
          className="col-sm-2 control-label"
        >
          Items*
        </label>
        <div className="col-sm-10">
          <table className="table table-bordered">
            <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {this.props.items.map((r, i) =>
            <VariationItem
              name={r.name}
              value={r.value}
              key={r + i}
              addRow={this.props.addVariationItem}
              deleteRow={this.props.deleteVariationItem.bind(null, i)}
              updateItem={this.props.editVariationItem.bind(null, i)}
            />)}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
ItemTable.propTypes = {
  addVariationItem: React.PropTypes.func.isRequired,
  deleteVariationItem: React.PropTypes.func.isRequired,
  editVariationItem: React.PropTypes.func.isRequired,
  items: React.PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
  return {
    id: state.id,
    projects: state.projects,
    margin: parseFloat(state.margin),
    adminFee: state.adminFee,
    time: state.time,
    subcontractor: state.subcontractor,
    invoiceNo: state.invoiceNumber,
    description: state.description,
    variations: state.variations,
    preparedFor: state.preparedFor
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateTime: (time) => {
      dispatch(updateTime(time));
    },
    updateSubcontractor: (value) => {
      dispatch(updateSubcontractor(value));
    },
    updateInvoiceNumber: (value) => {
      dispatch(updateInvoiceNumber(value));
    },
    updateMarginAndAdminFee: (id, margin, admin_fee) => {
      dispatch(updateMarginAndAdminFee(id, parseFloat(margin), admin_fee));
    },
    updateDescription: (value) => {
      dispatch(updateDescription(value));
    },
    updatePreparedFor: (value) => {
      dispatch(updatePreparedFor(value));
    },
    addVariationItem: () => {
      dispatch(addVariationItem('', ''));
    },
    deleteVariationItem: (index) => {
      dispatch(deleteVariationItem(index));
    },
    editVariationItem: (index, name, value) => {
      dispatch(editVariationItem(index, name, value));
    }
  };
};

class NewVariationForm extends React.Component {
  constructor() {
    super();
    this.handleHideModal = this.handleHideModal.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const instance = $(this.refs.form).parsley();
    instance.validate();
    if (!instance.isValid()) {
      return;
    }

    const project_id = this.props.id;
    const timeUTC = this.props.time;
    const subcontractor = this.props.subcontractor;
    const invoice_no = this.props.invoiceNo;
    const variationItems = this.props.variations;
    let input_amount = 0.0;
    variationItems.forEach((item) => {
      input_amount += parseFloat(item.value);
    });
    let input_description = '';
    if (variationItems.size === 1) {
      input_description = variationItems.get(0).name;
    } else {
      input_description = this.props.description;
    }
    const prepared_for = this.props.preparedFor;

    swal({
      title: 'Are you sure to add a variation?',
      text: [
        `Subcontractor: ${subcontractor}`,
        `Subtotal: ${accounting.formatMoney(input_amount)}`
      ].join('\n'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: 'Yes, add it!',
      cancelButtonText: 'No, cancel plx!',
      closeOnConfirm: false,
      closeOnCancel: false,
      customClass: 'newVariationConfirmation'
    }, (isConfirm) => {
      if (!isConfirm) {
        swal('Cancelled', 'The variation is not yet added :)', 'error');
        return;
      }

      const $button = $('.newVariationConfirmation').find('.confirm');
      const html = $button.html();
      $button.html(`<span class="fa fa-spinner fa-spin"></span> ${html}$`);

      console.log({ // eslint-disable-line no-console
        url: newVariationUrl,
        type: 'POST',
        data: JSON.stringify({
          project_id,
          date: timeUTC,
          subcontractor,
          invoice_no,
          amount: input_amount,
          description: input_description,
          prepared_for
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
      });

      $.ajax({
        url: newVariationUrl,
        type: 'POST',
        data: JSON.stringify({
          project_id,
          date: timeUTC,
          subcontractor,
          invoice_no,
          amount: input_amount,
          description: input_description,
          prepared_for
        }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
      }).fail(() => {
        swal({
          title: 'Error',
          text: 'Cannot save the variation... Please try again.',
          type: 'error'
        });
      }).done((data) => {
        const vid = data.vid;
        console.log(variationItems); // eslint-disable-line no-console
        const statusArray = new Array(variationItems.size).fill(null);

        (() => {
          const createVariationItem = (offset = 0) => {
            if (offset >= variationItems.size) {
              return;
            }
            const item = variationItems.get(offset);
            const desc = item.name;
            const amount = parseFloat(item.value);

            $.ajax({
              url: newItemUrl,
              type: 'POST',
              data: JSON.stringify({
                variation_id: vid,
                description: desc,
                amount
              }),
              contentType: 'application/json; charset=utf-8',
              dataType: 'json'
            }).done(() => {
              statusArray[offset] = true;
              createVariationItem(offset + 1);
            }).fail(() => {
              statusArray[offset] = false;
            });
          };
          createVariationItem(0);
        })();

        (() => {
          const waiting = () => {
            if (statusArray.some(isFalse)) {
              swal({
                title: 'Error',
                text: 'Cannot save the variation... Please try again.',
                type: 'error'
              });
            } else if (statusArray.some(isNull)) {
              setTimeout(waiting, spinInterval);
            } else if (statusArray.every(isTrue)) {
              swal({
                title: 'Nice!',
                text: 'You created a new variation',
                type: 'success'
              }, () => {
                location.pathname = `/project/${project_id}/variation`;
              });
            }
          };
          waiting();
        })();
      });
    });
  }

  handleHideModal() {
    $(this.refs.modal).modal('hide');
  }

  render() {
    return (
      <div
        id="new-variation-dialog"
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
              <Modal.Title>New Variation</Modal.Title>
            </Modal.Header>
            <div className="modal-body">
              <div className="container-fluid">
                <form
                  className="form-horizontal"
                  data-parsley-validate
                  ref="form"
                >
                  <Project
                    projects={this.props.projects}
                    cb={this.props.updateMarginAndAdminFee}
                  />
                  <TimePicker
                    cb={this.props.updateTime}
                  />
                  <PreparedFor
                    preparedFor={this.props.preparedFor}
                    cb={this.props.updatePreparedFor}
                  />
                  <Subcontractor
                    subcontractor={this.props.subcontractor}
                    cb={this.props.updateSubcontractor}
                  />
                  <InvoiceNo
                    invoiceNo={this.props.invoiceNo}
                    cb={this.props.updateInvoiceNumber}
                  />
                  <ValueOfWork
                    items={this.props.variations}
                  />
                  <Margin
                    value={this.props.margin}
                  />
                  <AdminFee
                    value={this.props.adminFee}
                  />
                  <Subtotal
                    items={this.props.variations}
                    margin={this.props.margin}
                    adminFee={this.props.adminFee}
                  />
                  <Description
                    items={this.props.variations}
                    cb={this.props.updateDescription}
                  />
                  <ItemTable
                    items={this.props.variations}
                    addVariationItem={this.props.addVariationItem}
                    deleteVariationItem={this.props.deleteVariationItem}
                    editVariationItem={this.props.editVariationItem}
                  />
                </form>
              </div>
            </div>
            <Modal.Footer>
              <p>* Required</p>
              <Button
                className="btn btn-primary btn-raised"
                data-dismiss="modal"
              >
                Dismiss
              </Button>
              <Button
                className="btn btn-info btn-raised"
                onClick={this.handleClick}
              >
                Add
              </Button>
            </Modal.Footer>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewVariationForm);
