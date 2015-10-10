(() => {
  'use strict';

  const TimePicker = React.createClass({
    render: function() {
      return (
          <div className="form-group">
            <label htmlFor="inputTime" className="col-sm-2 control-label">Time*</label>
            <div className="col-sm-10">
              <div className="input-group date" id="picker_datetime">
                <input type="text" className="form-control" required/>
                <span className="input-group-addon"><i className="fa fa-calendar"/></span>
              </div>
            </div>
          </div>
      );
    }
  });

  const Subcontractor = React.createClass({
    render: function() {
      return (
          <div className="form-group">
            <label htmlFor="inputSubcontractor" className="col-sm-2 control-label">Subcontractor*</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="input_subcontractor" placeholder="Name" required/>
            </div>
          </div>
      );
    }
  });

  const InvoiceNo = React.createClass({
    render: function() {
      return (
          <div className="form-group">
            <label htmlFor="inputInvoiceNo" className="col-sm-2 control-label">Invoice Number</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="input_invoice_no" placeholder="Optional"/>
            </div>
          </div>
      );
    }
  });

  const ValueOfWork = React.createClass({
    render: function() {
      const value = this.props.value;
      return (
          <div className="form-group">
            <label htmlFor="inputAmount" className="col-sm-2 control-label">Value of work</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="value-of-work" value={accounting.formatMoney(value)} placeholder={0.0} disabled/>
            </div>
          </div>
      )
    }
  });

  const Project = React.createClass({
    selectChange: function(event) {
      const p = this.props.projects.find(e => e.id.toString() === event.target.value);
      this.props.updateMarginAndAdminFee(p);
    },
    render: function() {
      return (
          <div className="form-group">
            <label className="col-sm-2 control-label">Project*</label>
            <div className="col-sm-10">
              <select id="select_project_id" className="form-control" onChange={this.selectChange} ref="select">
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
          <div className="form-group">
            <label htmlFor="inputAmount" className="col-sm-2 control-label">OH/Profit</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="margin" value={value} placeholder={0.0} disabled/>
            </div>
          </div>
      )
    }
  });

  const AdminFee = React.createClass({
    render: function() {
      const value = this.props.value;
      if (value === null) {
        return false;
      }
      return (
          <div className="form-group">
            <label htmlFor="inputAdminFee" className="col-sm-2 control-label">Admin-fee</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="admin-fee" value={accounting.formatMoney(value)} placeholder={0.0} disabled/>
            </div>
          </div>
      )
    }
  });

  const Subtotal = React.createClass({
    render: function() {
      const subtotal = this.props.valueOfWork * (1.0 + this.props.margin) + (this.props.adminFee === null ? 0 : this.props.adminFee);
      return (
          <div className="form-group">
            <label htmlFor="inputAmount" className="col-sm-2 control-label">Subtotal</label>
            <div className="col-sm-10">
              <input type="text" className="form-control" id="subtotal" value={accounting.formatMoney(subtotal)} placeholder={0.0} disabled/>
            </div>
          </div>
      );
    }
  });

  const VariationItem = React.createClass({
    render: function() {
      let mid;
      if (this.props.toolbar) {
        mid =
            <td style={{width: 150, textAlign: 'center', verticalAlign: 'middle'}}>
              <a href="javascript:void(0)" className="add-row" onClick={this.props.addRow}><span className="fa fa-plus"> </span>
                Add</a>
              /
              <a href="javascript:void(0)" className="delete-row" onClick={this.props.deleteRow}><span className="fa fa-minus"> </span>
                Delete</a>
            </td>
      } else {
        mid =
            <td style={{width: 150, textAlign: 'center', verticalAlign: 'middle'}}>
            </td>
      }
      return (
          <tr className="variationItem">
            <td>
              <textarea name="description" className="input-desc form-control" required/>
            </td>
            <td style={{verticalAlign: 'middle'}}>
              <input type="text" name="amount" className="input-amount form-control" required data-parsley-type="number" onInput={this.props.updateValueOfWork}/>
            </td>
            {mid}
          </tr>
      );
    }
  });

  const Description = React.createClass({
    render: function() {
      if (!this.props.show) {
        return false;
      }
      return (
          <div className="form-group" id="descriptionDiv">
            <label htmlFor="inputDescription" className="col-sm-2 control-label">Description*</label>
            <div className="col-sm-10">
              <textarea className="form-control" id="input_description" rows={5}/>
            </div>
          </div>
      );
    }
  });

  const NewVariationDialog = React.createClass({
    submit: function() {
      const instance = $('#form-new-variation').parsley();
      instance.validate();
      if (!instance.isValid()) {
        return;
      }

      const project_id = $('#select_project_id').val();
      const time = $('#picker_datetime').data('DateTimePicker').date();
      const timeUTC = time.utc().format();
      const subcontractor = $('#input_subcontractor').val();
      const invoice_no = $('#input_invoice_no').val();
      const input_amount = accounting.unformat($('#subtotal').val());
      let input_description = '';
      const $variationItems = $('.variationItem');
      if ($variationItems.length === 1) {
        input_description = $variationItems.find('textarea').val();
      } else {
        input_description = $('#input_description').val();
      }

      swal({
        title: 'Are you sure to add a variation?',
        text: [
          `Time: ${time.format('Do MMMM YYYY h:mm:ss a')}`,
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
              const $variationItems = $('.variationItem');

              const statusArray = new Array($variationItems.length).fill(null);

              (function createVariationItem(offset) {
                if (offset >= $variationItems.length) {
                  return;
                }
                const $elem = $($variationItems[offset]);
                const desc = $elem.find('.input-desc').val();
                const amount = $elem.find('.input-amount').val();

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
        valueOfWork: 0.0,
        margin: 0.0,
        adminFee: null,
        showDescription: false
      }
    },
    componentDidMount: function() {
      this.loadProjects();
      setInterval(this.loadProjects, this.props.pollInterval);
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
    updateValueOfWork: function() {
      let total = 0.0;
      $('.input-amount').each((index, element) => {
        const val = $(element).val();
        if (val !== '' && $.isNumeric(val)) {
          total += parseFloat(val);
        }
      });
      this.setState({
        valueOfWork: total
      });
    },
    updateMarginAndAdminFee: function(project) {
      if (project !== undefined) {
        this.setState({
          margin: project.margin,
          adminFee: project.admin_fee
        });
      } else {
        this.setState({
          margin: 0.0,
          adminFee: 0.0
        });
      }
      this.updateValueOfWork();
    },
    updateDescription: function(e) {
      if (e > 1) {
        this.setState({
          showDescription: true
        });
      } else {
        this.setState({
          showDescription: false
        });
      }
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
                    <form className="form-horizontal" id="form-new-variation" data-parsley-validate>
                      <Project projects={this.state.projects} updateMarginAndAdminFee={this.updateMarginAndAdminFee}/>
                      <TimePicker />
                      <Subcontractor />
                      <InvoiceNo />
                      <ValueOfWork value={this.state.valueOfWork}/>
                      <Margin value={this.state.margin}/>
                      <AdminFee value={this.state.adminFee}/>
                      <Subtotal valueOfWork={this.state.valueOfWork} margin={this.state.margin} adminFee={this.state.adminFee}/>
                      <Description show={this.state.showDescription}/>
                      <ItemTable updateValueOfWork={this.updateValueOfWork} updateDescription={this.updateDescription}/>
                    </form>
                  </div>
                </div>
                <div className="modal-footer">
                  <p>* Required</p>
                  <button className="btn btn-primary btn-raised" data-dismiss="modal">Dismiss</button>
                  <button id="btn_submit" className="btn btn-info btn-raised" onClick={this.submit}>Add</button>
                </div>
              </div>
            </div>
          </div>
      );
    }
  });

  const ItemTable = React.createClass({
    addRow: function() {
      this.props.updateDescription(this.state.numRows + 1);
      this.setState({numRows: this.state.numRows + 1});
    },
    deleteRow: function() {
      if (this.state.numRows > 1) {
        this.props.updateDescription(this.state.numRows - 1);
        this.setState({numRows: this.state.numRows - 1});
      }
    },
    getInitialState: function() {
      return {
        numRows: 1
      }
    },
    render: function() {
      const rows = [];
      for (let i = 0; i < this.state.numRows; ++i) {
        rows.push(i);
      }
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
                <tbody id="items">
                {rows.map((r, i) =>
                <VariationItem key={r} addRow={this.addRow} deleteRow={this.deleteRow} updateValueOfWork={this.props.updateValueOfWork} toolbar={i == rows.length -1}/>)}
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
