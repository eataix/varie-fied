(() => {
  'use strict';
  const metaData = $('#project-data').data();
  const projectId = metaData.projectId;
  const projectRefNo = metaData.projectRefNo;
  const projectName = metaData.projectName;
  const projectMargin = parseFloat(metaData.projectMargin);
  const projectAdminFee = $.isNumeric(metaData.projectAdminFee) ? parseFloat(metaData.projectAdminFee) : '';

  const EditProjectMetaForm = React.createClass({
    render: function() {
      return (
          <div id="edit-dialog" className="modal fade" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span></button>
                  <h2 className="modal-title">Edit Project</h2>
                </div>
                <div className="modal-body">
                  <div className="container-fluid">
                    <form className="form-horizontal" id="edit-project-meta-form">
                      <div className="form-group">
                        <label htmlFor="new_name" className="col-sm-3 control-label">Project Name</label>

                        <div className="col-sm-9">
                          <input type="text" className="form-control" id="new_name" placeholder="Name" required defaultValue={projectName}/>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="new_ref_number" className="col-sm-3 control-label">Reference Number</label>

                        <div className="col-sm-9">
                          <input type="text" className="form-control" id="new_ref_number" placeholder="Reference Number" required defaultValue={projectRefNo}/>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="new_margin" className="col-sm-3 control-label">OH/Profit</label>

                        <div className="col-sm-9">
                          <input type="text" className="form-control" id="new_margin" placeholder="Optional" required defaultValue={projectMargin} data-parsley-type="number"/>
                        </div>
                      </div>
                      <div className="form-group">
                        <label htmlFor="new_admin_fee" className="col-sm-3 control-label">Fixed Administration
                                                                                          fee</label>
                        <div className="col-sm-9">
                          <input type="text" className="form-control" id="new_admin_fee" placeholder="(optional)" defaultValue={projectAdminFee}/>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary btn-raised" data-dismiss="modal">Dismiss</button>
                  <button id="btn-save-meta" className="btn btn-info btn-raised" onClick={this.submit}>Save</button>
                </div>
              </div>
            </div>
          </div>
      )
    },
    submit: function() {
      const instance = $('#edit-project-meta-form').parsley();
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

        const new_name = $('#new_name').val();
        const new_margin = $('#new_margin').val();
        const new_reference_number = $('#new_ref_number').val();
        let new_admin_fee = $('#new_admin_fee').val();
        if (new_admin_fee === '') {
          new_admin_fee = null;
        }
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
            })
            .done(() =>
                swal({
                  title: 'Nice!',
                  text: 'Save changes',
                  type: 'success'
                }, () => $('#edit-dialog').modal('hide'))
            );
      });
    }
  });

  ReactDOM.render(
      <EditProjectMetaForm />,
      document.getElementById('meta-edit-form')
  );
})();