(() => {
  'use strict';

  var ProjectName = React.createClass({
    render: function() {
      return (
          <div className="form-group">
            <label htmlFor="extra_project_name" className="col-sm-3 control-label">Project Name*</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" id="extra_project_name" required/>
            </div>
          </div>
      );
    }
  });
  var ReferenceNo = React.createClass({
    render: function() {
      return (
          <div className="form-group">
            <label htmlFor="extra_reference_number" className="col-sm-3 control-label">Reference Number*</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" id="extra_reference_number" required/>
            </div>
          </div>
      );
    }
  });
  var OH = React.createClass({
    render: function() {
      return (
          <div className="form-group">
            <label htmlFor="extra_margin" className="col-sm-3 control-label">OH/Profit*</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" id="extra_margin" required data-parsley-type="number"/>
            </div>
          </div>
      );
    }
  });

  var AdminFee = React.createClass({
    render: function() {
      return (
          <div className="form-group">
            <label htmlFor="extra_admin_fee" className="col-sm-3 control-label">Administration Fee</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" id="extra_admin_fee" data-parsley-type="number" placeholder="optional"/>
            </div>
          </div>
      )
    }
  });
  var ClientList = React.createClass({
    getInitialState: function() {
      return {
        numRows: 1
      }
    },
    addRow: function() {
      this.setState({numRows: this.state.numRows + 1});
    },
    deleteRow: function() {
      if (this.state.numRows > 1) {
        this.setState({numRows: this.state.numRows - 1});
      }
    },
    render: function() {
      var rows = [];
      for (var i = 0; i < this.state.numRows; ++i) {
        rows.push(i);
      }
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
                <tbody id="clients">
                {rows.map((r) =>
                <Client key={r} addRow={this.addRow} deleteRow={this.deleteRow}/>)}
                </tbody>
              </table>
            </div>
          </div>
      );
    }
  });

  var Client = React.createClass({
    render: function() {
      return (<tr className="client">
        <td>
          <textarea name="clientName" className="input-client-name form-control" required />
        </td>
        <td style={{verticalAlign: 'middle'}}>
          <input type="text" name="firstAddressLine" className="input-first-address form-control" required/>
        </td>
        <td style={{verticalAlign: 'middle'}}>
          <input type="text" name="secondAddressLine" className="input-second-address form-control" required/>
        </td>
        <td style={{width: 80, textAlign: 'center', verticalAlign: 'middle'}}>
          <a href="javascript:void(0)" className="add-row" onClick={this.props.addRow}><i className="fa fa-plus"></i></a>
          /
          <a href="javascript:void(0)" className="delete-row" onClick={this.props.deleteRow}><i className="fa fa-minus"></i></a>
        </td>
      </tr>)
    }
  });

  var NewProjectForm = React.createClass({
    render: function() {
      return (
          <div id="new-project-dialog" className="modal fade" tabIndex={-1}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-hidden="true">×</button>
                  <h2 className="modal-title">Add Project</h2>
                </div>
                <div className="modal-body">
                  <div className="container-fluid">
                    <form className="form-horizontal" id="form-new-project" data-parsley-validate>
                      <ProjectName />
                      <ReferenceNo />
                      <OH />
                      <AdminFee />
                      <ClientList />
                    </form>
                  </div>
                </div>
                <div className="modal-footer">
                  <p>* Required</p>
                  <button className="btn btn-primary btn-raised" data-dismiss="modal">Dismiss</button>
                  <button id="btn-add-project" className="btn btn-info btn-raised" onClick={this.submit}>Save</button>
                </div>
              </div>
            </div>
          </div>
      );
    },
    submit: function() {
      const instance = $('#form-new-project').parsley();
      instance.validate();
      if (!instance.isValid()) {
        return;
      }

      const project_name = $('#extra_project_name').val();
      const margin = $('#extra_margin').val();
      const reference_number = $('#extra_reference_number').val();
      let admin_fee = $('#extra_admin_fee').val();
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
              const $clientElements = $('.client');
              const statusArray = new Array($clientElements.length).fill(null);

              (function createClient(offset) {
                if (offset >= $clientElements.length) {
                  return;
                }
                const $elem = $($clientElements[offset]);
                const name = $elem.find('.input-client-name').val();
                let first_line_address = $elem.find('.input-first-address').val();
                if (first_line_address === '') {
                  first_line_address = null;
                }
                let second_line_address = $elem.find('.input-second-address').val();
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
                      },
                      () => location.reload()
                  );
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