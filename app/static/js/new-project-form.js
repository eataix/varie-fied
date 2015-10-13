const FluxStore = require('./flux');
const store = FluxStore.store;
const actions = FluxStore.actions;
const changes = FluxStore.changes;

(() => {
  'use strict';

  var Input = ReactBootstrap.Input;
  var Button = ReactBootstrap.Button;

  const ProjectName = React.createClass({
    handleChange: function(event) {
      actions.newProjectName(event.target.value);
    },
    render: function() {
      return (
          <Input type="text" label="Project Name*" labelClassName="col-sm-3" wrapperClassName="col-sm-9" required onChange={this.handleChange} value={this.props.value}/>
      );
    }
  });
  const ReferenceNo = React.createClass({
    handleChange: function(event) {
      actions.newProjectRefNum(event.target.value);
    },
    render: function() {
      return (
          <Input type="text" label="Reference Number*" labelClassName="col-sm-3" wrapperClassName="col-sm-9" required onChange={this.handleChange} value={this.props.value}/>
      );
    }
  });
  const OH = React.createClass({
    handleChange: function(event) {
      actions.newProjectOH(event.target.value);
    },
    render: function() {
      return (
          <Input type="text" label="Reference Number*" labelClassName="col-sm-3" wrapperClassName="col-sm-9" required data-parsley-type="number" onChange={this.handleChange} value={this.props.value}/>
      );
    }
  });
  const AdminFee = React.createClass({
    handleChange: function() {
      actions.newProjectAdminFee(event.target.value);
    },
    render: function() {
      return (
          <Input type="text" label="Reference Number*" labelClassName="col-sm-3" wrapperClassName="col-sm-9" data-parsley-type="number" placeholder="optional" onChange={this.handleChange} value={this.props.value}/>
      )
    }
  });
  const ClientList = React.createClass({
    addRow: function() {
      actions.addItem({
        name: '',
        value: {
          first: '',
          second: ''
        }
      })
    },
    deleteRow: function(index) {
      actions.removeItem(index);
    },
    updateItem: function(index, name, first, second) {
      actions.updateItem(index, {
        name: name,
        value: {
          first: first,
          second: second
        }
      });
    },
    render: function() {
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
                {this.props.clients.map((r, i) =>
                    <Client key={r + i} addRow={this.addRow} deleteRow={this.deleteRow.bind(null, i)} updateItem={this.updateItem.bind(null, i)} name={r.name} first={r.value.first} second={r.value.second}/>)}
                </tbody>
              </table>
            </div>
          </div>
      );
    }
  });

  const Client = React.createClass({
    handleChange: function() {
      this.props.updateItem(this.refs.name.getValue(), this.refs.first.getValue(), this.refs.second.getValue());
    },
    render: function() {
      return (<tr className="client">
        <td>
          <Input standalone={true} type="textarea" required ref="name" value={this.props.name} onChange={this.handleChange}/>
        </td>
        <td style={{verticalAlign: 'middle'}}>
          <Input standalone={true} type="text" required onChange={this.handleChange} ref="first" value={this.props.first}/>
        </td>
        <td style={{verticalAlign: 'middle'}}>
          <Input standalone={true} type="text" required onChange={this.handleChange} ref="second" value={this.props.second}/>
        </td>
        <td style={{width: 80, textAlign: 'center', verticalAlign: 'middle'}}>
          <a href="javascript:void(0)" onClick={this.props.addRow}><i className="fa fa-plus"></i></a>
          /
          <a href="javascript:void(0)" onClick={this.props.deleteRow}><i className="fa fa-minus"></i></a>
        </td>
      </tr>);
    }
  });

  const NewProjectForm = React.createClass({
    getInitialState: function() {
      return {
        name: store.getNewName(),
        margin: store.getNewOH(),
        refNum: store.getNewRefNum(),
        adminFee: store.getNewAdminFee(),
        list: store.getList()
      }
    },
    componentDidMount: function() {
      store.addChangeListener(changes.ITEMS_CHANGE, this._onListChange);
      store.addChangeListener(changes.NEW_INFO_CHANGE, this._onInfoChange);
    },
    componentWillUnmount: function() {
      store.removeChangeListener(changes.NEW_INFO_CHANGE, this._onInfoChange);
      store.removeChangeListener(changes.ITEMS_CHANGE, this._onListChange);
    },
    _onInfoChange: function() {
      this.setState({
        name: store.getNewName(),
        refNum: store.getNewRefNum(),
        margin: store.getNewOH(),
        adminFee: store.getNewAdminFee()
      });
      console.log({
        name: store.getNewName(),
        refNum: store.getNewRefNum(),
        margin: store.getNewOH(),
        adminFee: store.getNewAdminFee()
      });
    },
    _onListChange: function() {
      this.setState({list: store.getList()});
      console.log({
        list: store.getList()
      });
    },
    render: function() {
      return (
          <div id="new-project-dialog" ref="modal" className="modal fade" tabIndex={-1}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h2 className="modal-title">Add Project</h2>
                </div>
                <div className="modal-body">
                  <div className="container-fluid">
                    <form ref="form" className="form-horizontal" data-parsley-validate>
                      <ProjectName value={this.state.name}/>
                      <ReferenceNo value={this.state.refNum}/>
                      <OH value={this.state.margin}/>
                      <AdminFee value={this.state.adminFee}/>
                      <ClientList clients={this.state.list}/>
                    </form>
                  </div>
                </div>
                <div className="modal-footer">
                  <p>* Required</p>
                  <Button className="btn btn-primary btn-raised" data-dismiss="modal">Dismiss</Button>
                  <Button className="btn btn-info btn-raised" onClick={this.submit}>Save</Button>
                </div>
              </div>
            </div>
          </div>
      );
    },
    submit: function() {
      console.log(store);
      const instance = $(this.refs.form.getDOMNode()).parsley();
      instance.validate();
      if (!instance.isValid()) {
        return;
      }


      const project_name = store.getNewName();
      const margin = store.getNewOH();
      const reference_number = store.getNewRefNum();
      let admin_fee = store.getNewAdminFee();
      // in case admin_fee is unspecified
      if (admin_fee === '') {
        admin_fee = null;
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
            .done(data => {
              const clients = store.getList();
              const statusArray = new Array(clients.length).fill(null);

              (function createClient(offset) {
                if (offset >= clients.length) {
                  return;
                }
                const client = clients[offset];
                const name = client.name;
                let first_line_address = client.value.first;
                if (first_line_address === '') {
                  first_line_address = null;
                }
                let second_line_address = client.value.second;
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
              })(0); // IIFE

              (function waiting() {
                if (statusArray.some(isFalse)) {
                  swal('Error', 'Cannot save the project... Please try again.', 'error');
                } else if (statusArray.some(isNull)) {
                  setTimeout(waiting, 100);
                } else if (statusArray.every(isTrue)) {
                  swal({
                    title: 'Nice!',
                    text: `You created a new project: ${data.name}`,
                    type: 'success'
                  }, () => $(this.refs.modal.getDOMNode()).modal('hide'));
                }
              })();
            });
      });
    }
  });

  ReactDOM.render(
      <NewProjectForm />,
      document.getElementById('new-project-form-container')
  );
})();