const FluxStore = require('./flux');
const store = FluxStore.store;
const actions = FluxStore.actions;
const changes = FluxStore.changes;

(function() {
  'use strict';

  var Input = ReactBootstrap.Input;
  var Button = ReactBootstrap.Button;

  const TimePicker = React.createClass({
    componentDidMount: function() {
      $(this.refs.picker.getDOMNode()).datetimepicker({
        showTodayButton: true
      }).on('dp.change', function(event) {
        actions.updateTime(event.date.utc().format());
      });
    },
    render: function() {
      return (
          <div className="form-group">
            <label htmlFor="inputTime" className="col-sm-2 control-label">Time*</label>
            <div className="col-sm-10">
              <div className="input-group date" ref="picker">
                <input type="text" className="form-control" required/>
                <span className="input-group-addon"><i className="fa fa-calendar"/></span>
              </div>
            </div>
          </div>
      );
    }
  });

  const Subcontractor = React.createClass({
    handleChange: function() {
      actions.updateSubcontractor(event.target.value);
    },
    render: function() {
      return (
          <Input type="text" label="Subcontractor*" labelClassName="col-sm-2" wrapperClassName="col-sm-10" required onChange={this.handleChange}/>
      );
    }
  });

  const InvoiceNo = React.createClass({
    handleChange: function() {
      actions.updateInvoiceNumber(event.target.value);
    },
    render: function() {
      return (
          <Input type="text" label="Invoice Number" labelClassName="col-sm-2" wrapperClassName="col-sm-10" placeholder="Optional" onChange={this.handleChange}/>
      );
    }
  });

  const ValueOfWork = React.createClass({
    render: function() {
      let value = 0.0;
      this.props.items.forEach((item) => value += item.value.amount);
      return (
          <Input type="text" label="Value of Work" labelClassName="col-sm-2" wrapperClassName="col-sm-10" value={accounting.formatMoney(value)} placeholder={0.0} disabled/>
      )
    }
  });

  const Project = React.createClass({
    handleChange: function(event) {
      const p = this.props.projects.find(e => e.id.toString() === event.target.value);
      actions.updateMarginAndAdminFee(p.id, p.margin, p.admin_fee);
    },
    render: function() {
      return (
          <div className="form-group">
            <label className="col-sm-2 control-label">Project*</label>
            <div className="col-sm-10">
              <select className="form-control" onChange={this.handleChange} ref="select">
                <option value="-1">Select a project</option>
                {this.props.projects.map(v=> <option key={v.id} value={v.id}>{v.name}</option>)}
              </select>
            </div>
          </div>
      );
    }
  });

  const Margin = React.createClass({
    render: function() {
      const value = `${accounting.formatNumber(this.props.value * 100.0)} %`;
      return (
          <Input type="text" label="OH/Profit" labelClassName="col-sm-2" wrapperClassName="col-sm-10" value={value} placeholder={0.0} disabled/>
      );
    }
  });

  const AdminFee = React.createClass({
    render: function() {
      const value = this.props.value;
      if (value === null) {
        return false;
      }
      return (
          <Input type="text" label="Admin Fee" labelClassName="col-sm-2" wrapperClassName="col-sm-10" value={accounting.formatMoney(value)} placeholder={0.0} disabled/>
      );
    }
  });

  const Subtotal = React.createClass({
    render: function() {
      let valueOfWork = 0.0;
      this.props.items.forEach((item) => {
        valueOfWork += item.value.amount;
      });
      const subtotal = valueOfWork * (1.0 + this.props.margin) + (this.props.adminFee === null ? 0 : this.props.adminFee);
      return (
          <Input type="text" label="Subtotal" labelClassName="col-sm-2" wrapperClassName="col-sm-10" value={accounting.formatMoney(subtotal)} placeholder={0.0} disabled/>
      );
    }
  });

  const VariationItem = React.createClass({
    handleChange: function() {
      this.props.updateItem(this.refs.name.getValue(), this.refs.value.getValue());
    },
    render: function() {
      return (
          <tr className="variationItem">
            <td>
              <Input standalone={true} type="textarea" ref="name" required value={this.props.name} onChange={this.handleChange}/>
            </td>
            <td style={{verticalAlign: 'middle'}}>
              <Input standalone={true} type="text" ref="value" required data-parsley-type="number" onChange={this.handleChange} value={this.props.value}/>
            </td>
            <td style={{width: 150, textAlign: 'center', verticalAlign: 'middle'}}>
              <a href="javascript:void(0)" className="add-row" onClick={this.props.addRow}><span className="fa fa-plus"> </span>
                Add</a>
              /
              <a href="javascript:void(0)" className="delete-row" onClick={this.props.deleteRow}><span className="fa fa-minus"> </span>
                Delete</a>
            </td>
          </tr>
      );
    }
  });

  const Description = React.createClass({
    handleChange: function() {
      actions.updateDescription(event.target.value);
    },
    render: function() {
      if (this.props.items.length === 1) {
        return false;
      }
      return (
          <Input type="textarea" label="Description" labelClassName="col-sm-2" wrapperClassName="col-sm-10" rows={5} onChange={this.handleChange}/>
      );
    }
  });

  const NewVariationDialog = React.createClass({
    submit: function() {
      const instance = $(this.refs.form.getDOMNode()).parsley();
      instance.validate();
      if (!instance.isValid()) {
        return;
      }

      const project_id = store.getId();
      const timeUTC = store.getTime();
      const subcontractor = store.getSubcontractor();
      const invoice_no = store.getInvoiceNumber();
      const variationItems = store.getList();
      let input_amount = 0.0;
      variationItems.forEach(function(item) {
        input_amount += item.value.amount;
      });
      let input_description = '';
      if (variationItems.length === 1) {
        input_description = variationItems[0].name;
      } else {
        input_description = store.getDescription();
      }

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
      }, isConfirm => {
        if (!isConfirm) {
          swal('Cancelled', 'The variation is not yet added :)', 'error');
          return;
        }

        const $button = $('.newVariationConfirmation').find('.confirm');
        const html = $button.html();
        $button.html('<i class="fa fa-spinner fa-spin"></i> ' + html);

        $.ajax({
              url: newVariationUrl,
              type: 'POST',
              data: JSON.stringify({
                project_id: project_id,
                date: timeUTC,
                subcontractor: subcontractor,
                invoice_no: invoice_no,
                amount: input_amount,
                description: input_description
              }),
              contentType: 'application/json; charset=utf-8',
              dataType: 'json'
            })
            .fail(() => {
              swal({
                title: 'Error',
                text: 'Cannot save the variation... Please try again.',
                type: 'error'
              });
            })
            .done(data => {
              const vid = data.vid;
              const variationItems = store.getList();

              const statusArray = new Array(variationItems.length).fill(null);

              (function createVariationItem(offset) {
                if (offset >= variationItems.length) {
                  return;
                }
                const item = variationItems[offset];
                const desc = item.name;
                const amount = item.value.amount;

                $.ajax({
                      url: newItemUrl,
                      type: 'POST',
                      data: JSON.stringify({
                        variation_id: vid,
                        description: desc,
                        amount: amount
                      }),
                      contentType: 'application/json; charset=utf-8',
                      dataType: 'json'
                    })
                    .done(() => {
                      statusArray[offset] = true;
                      createVariationItem(offset + 1);
                    })
                    .fail(() => statusArray[offset] = false);
              })(0); // invoke

              (function waiting() {
                if (statusArray.some(isFalse)) {
                  swal({
                    title: 'Error',
                    text: 'Cannot save the variation... Please try again.',
                    type: 'error'
                  });
                } else if (statusArray.some(isNull)) {
                  setTimeout(waiting, 100);
                } else if (statusArray.every(isTrue)) {
                  swal({
                    title: 'Nice!',
                    text: 'You created a new variation',
                    type: 'success'
                  }, () => location.reload());
                }
              })(); // invoke
            });
      });
    },
    getInitialState: function() {
      return {
        projects: [],
        margin: store.getMargin(),
        adminFee: store.getAdminFee(),
        list: store.getList(),
        showDescription: false
      }
    },
    componentDidMount: function() {
      this.loadProjects();
      setInterval(this.loadProjects, this.props.pollInterval);
      store.addChangeListener(changes.ITEMS_CHANGE, this._onListChange);
      store.addChangeListener(changes.MARGIN_AND_ADMIN_FEE, this._onMarginChange);
    },
    componentWillUnmount: function() {
      store.removeChangeListener(changes.ITEMS_CHANGE, this._onListChange);
      store.removeChangeListener(changes.MARGIN_AND_ADMIN_FEE, this._onMarginChange);
    },
    _onMarginChange: function() {
      this.setState({
        margin: store.getMargin(),
        adminFee: store.getAdminFee()
      });
    },
    _onListChange: function() {
      this.setState({
        list: store.getList()
      });
    },
    loadProjects: function() {
      $.ajax({
        url: this.props.project_url,
        dataType: 'json',
        success: function(data) {
          this.setState({
            projects: data.projects
          });
        }.bind(this),
        fail: function(xhr, status, err) {
          console.error(this.props.project_url, status, err.toString())
        }.bind(this)
      });
    },
    render: function() {
      return (
          <div id="new-variation-dialog" className="modal fade" tabIndex={-1}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span></button>
                  <h2 className="modal-title">New Variation</h2>
                </div>
                <div className="modal-body">
                  <div className="container-fluid">
                    <form className="form-horizontal" data-parsley-validate ref="form">
                      <Project projects={this.state.projects}/>
                      <TimePicker />
                      <Subcontractor />
                      <InvoiceNo />
                      <ValueOfWork items={this.state.list}/>
                      <Margin value={this.state.margin}/>
                      <AdminFee value={this.state.adminFee}/>
                      <Subtotal items={this.state.list} margin={this.state.margin} adminFee={this.state.adminFee}/>
                      <Description items={this.state.list}/>
                      <ItemTable items={this.state.list}/>
                    </form>
                  </div>
                </div>
                <div className="modal-footer">
                  <p>* Required</p>
                  <button className="btn btn-primary btn-raised" data-dismiss="modal">Dismiss</button>
                  <button className="btn btn-info btn-raised" onClick={this.submit}>Add
                  </button>
                </div>
              </div>
            </div>
          </div>
      );
    }
  });

  const ItemTable = React.createClass({
    addRow: function() {
      actions.addItem({
        name: '',
        value: {
          amount: ''
        }
      });
    },
    deleteRow: function(index) {
      actions.removeItem(index);
    },
    updateItem: function(index, name, value) {
      actions.updateItem(index, {name: name, value: {amount: value === '' ? '' : parseFloat(value)}});
    },
    render: function() {
      return (
          <div className="form-group">
            <label htmlFor="inputDescription" className="col-sm-2 control-label">Items*</label>
            <div className="col-sm-10">
              <table className="table table-bordered">
                <thead>
                <tr>
                  <th style={{textAlign: 'center'}}>Name</th>
                  <th style={{textAlign: 'center'}}>Amount</th>
                  <th style={{textAlign: 'center'}}>Action</th>
                </tr>
                </thead>
                <tbody>
                {this.props.items.map((r, i) =>
                    <VariationItem name={r.name} value={r.value.amount} key={r + i} addRow={this.addRow} deleteRow={this.deleteRow.bind(null, i)} updateItem={this.updateItem.bind(null, i)}/>)}
                </tbody>
              </table>
            </div>
          </div>
      );
    }
  });

  const project_url = $('#meta-data').data().projectsUrl;

  ReactDOM.render(
      <NewVariationDialog project_url={project_url} pollInterval={2000}/>,
      document.getElementById('new-variation-form-container')
  );
})();
