const AppDispatcher = new Flux.Dispatcher();

AppDispatcher.handleAction = function(action) {
  'use strict';
  this.dispatch({
    source: 'VIEW_ACTION',
    action: action
  });
};

const constants = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  UPDATE_MARGIN_AND_ADMIN_FEE: 'UPDATE_MARGIN_AND_ADMIN_FEE',
  UPDATE_TIME: 'UPDATE_TIME',
  UPDATE_SUBCONTRACTOR: 'UPDATE_SUBCONTRACTOR',
  UPDATE_INVOICE_NUMBER: 'UPDATE_INVOICE_NUMBER',
  UPDATE_DESCRIPTION: 'UPDATE_DESCRIPTION'
};

const actions = {
  addItem: function(item) {
    'use strict';
    AppDispatcher.handleAction({
      actionType: constants.ADD_ITEM,
      data: item
    });
  },
  removeItem: function(index) {
    'use strict';
    AppDispatcher.handleAction({
      actionType: constants.REMOVE_ITEM,
      data: index
    });
  },
  updateItem: function(index, item) {
    'use strict';
    AppDispatcher.handleAction({
      actionType: constants.UPDATE_ITEM,
      data: {
        index: index,
        item: item
      }
    });
  },
  updateMarginAndAdminFee: function(id, margin, adminFee) {
    'use strict';
    AppDispatcher.handleAction({
      actionType: constants.UPDATE_MARGIN_AND_ADMIN_FEE,
      data: {
        id: id,
        margin: margin,
        adminFee: adminFee
      }
    });
  },
  updateTime: function(time) {
    'use strict';
    AppDispatcher.handleAction({
      actionType: constants.UPDATE_TIME,
      data: time
    });
  },
  updateSubcontractor: function(subcontractor) {
    'use strict';
    AppDispatcher.handleAction({
      actionType: constants.UPDATE_SUBCONTRACTOR,
      data: subcontractor
    });
  },
  updateInvoiceNumber: function(invoiceNumber) {
    'use strict';
    AppDispatcher.handleAction({
      actionType: constants.UPDATE_INVOICE_NUMBER,
      data: invoiceNumber
    });
  },
  updateDescription: function(description) {
    'use strict';
    AppDispatcher.handleAction({
      actionType: constants.UPDATE_DESCRIPTION,
      data: description
    });
  }
};

const changes = {
  ITEMS_CHANGE: 'ITEMS_CHANGE',
  MARGIN_AND_ADMIN_FEE: 'MARGIN_AND_ADMIN_FEE'
};

var _store = {
  list: [{
    name: '',
    value: null
  }],
  margin: 0.0,
  adminFee: null,
  id: null,
  time: null,
  subcontract: null,
  invoiceNumber: null,
  description: null
};

const addItem = function(item) {
  'use strict';
  _store.list.push(item);
};

const removeItem = function(index) {
  'use strict';
  if (_store.list.length > 1) {
    _store.list.splice(index, 1);
  }
};

const updateItem = function(index, item) {
  'use strict';
  _store.list[index] = item;
};

const updateMarginAndAdminFee = function(id, margin, adminFee) {
  'use strict';
  _store.id = id;
  _store.margin = margin;
  _store.adminFee = adminFee;
};

const updateTime = function(time) {
  'use strict';
  _store.time = time;
};

const updateSubcontractor = function(subcontractor) {
  'use strict';
  _store.subcontract = subcontractor;
};

const updateInvoiceNumber = function(invoiceNumber) {
  'use strict';
  _store.invoiceNumber = invoiceNumber;
};

const updateDescription = function(description) {
  'use strict';
  _store.description = description;
};

const store = Object.assign({}, EventEmitter2.prototype, {
  addChangeListener: function(type, cb) {
    'use strict';
    this.on(type, cb);
  },
  removeChangeListener: function(type, cb) {
    'use strict';
    this.removeListener(type, cb);
  },
  getList: function() {
    'use strict';
    return _store.list;
  },
  getMargin: function() {
    'use strict';
    return _store.margin;
  },
  getAdminFee: function() {
    'use strict';
    return _store.adminFee;
  },
  getId: function() {
    'use strict';
    return _store.id;
  },
  getTime: function() {
    'use strict';
    return _store.time;
  },
  getSubcontractor: function() {
    'use strict';
    return _store.subcontract;
  },
  getInvoiceNumber: function() {
    'use strict';
    return _store.invoiceNumber;
  },
  getDescription: function() {
    'use strict';
    return _store.description;
  }
});

AppDispatcher.register(function(payload) {
  'use strict';
  var action = payload.action;
  switch (action.actionType) {
    case constants.ADD_ITEM:
      addItem(action.data);
      store.emit(changes.ITEMS_CHANGE);
      break;
    case constants.REMOVE_ITEM:
      removeItem(action.data);
      store.emit(changes.ITEMS_CHANGE);
      break;
    case constants.UPDATE_ITEM:
      updateItem(action.data.index, action.data.item);
      store.emit(changes.ITEMS_CHANGE);
      break;
    case constants.UPDATE_MARGIN_AND_ADMIN_FEE:
      updateMarginAndAdminFee(action.data.id, action.data.margin, action.data.adminFee);
      store.emit(changes.MARGIN_AND_ADMIN_FEE);
      break;
    case constants.UPDATE_TIME:
      updateTime(action.data);
      break;
    case constants.UPDATE_SUBCONTRACTOR:
      updateSubcontractor(action.data);
      break;
    case constants.UPDATE_INVOICE_NUMBER:
      updateInvoiceNumber(action.data);
      break;
    case constants.UPDATE_DESCRIPTION:
      updateDescription(action.data);
      break;
    default:
      return true;
  }
});

module.exports = {
  constants: constants,
  actions: actions,
  changes: changes,
  store: store
};
