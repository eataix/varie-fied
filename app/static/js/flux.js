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
  UPDATE_VALUE_OF_WORK: 'UPDATE_VALUE_OF_WORK'
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
  id: null
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
