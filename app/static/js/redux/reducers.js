import Immutable from 'immutable';

import {
  ADD_VARIATION_ITEM, DELETE_VARIATION_ITEM, EDIT_VARIATION_ITEM,
  ADD_CLIENT, DELETE_CLIENT, EDIT_CLIENT,
  ADD_PROGRESS_ITEM, DELETE_PROGRESS_ITEM, EDIT_PROGRESS_ITEM,
  UPDATE_MARGIN_AND_ADMIN_FEE, UPDATE_TIME, UPDATE_SUBCONTRACTOR, UPDATE_INVOICE_NUMBER, UPDATE_DESCRIPTION,
  NEW_PROJECT_NAME, NEW_PROJECT_REF_NUMBER, NEW_PROJECT_MARGIN, NEW_PROJECT_ADMIN_FEE,
  EDIT_PROJECT_NAME, EDIT_PROJECT_REF_NUMBER, EDIT_PROJECT_MARGIN, EDIT_PROJECT_ADMIN_FEE,
  LOAD_PROJECTS,
  LOAD_PROJECT,
} from './actions';

const initialState = {
  variations: Immutable.List([{
    name: '',
    value: ''
  }]),
  clients: Immutable.List([{
    name: '',
    first: '',
    second: ''
  }]),
  progressItems: Immutable.List([{
    name: '',
    value: ''
  }]),
  margin: 0.0,
  adminFee: '',
  time: '',
  subcontract: '',
  invoiceNumber: '',
  description: '',
  newName: '',
  newRefNum: '',
  newMargin: '',
  newAdminFee: '',
  projects: [],
  project: null,
  editName: '',
  editRefNum: '',
  editMargin: '',
  editAdminFee: ''
};

export default function app(state = initialState, action) {
  'use strict';
  switch (action.type) {
    case ADD_VARIATION_ITEM:
      return Object.assign({}, state, {
        variations: state.variations.push({
          name: '',
          value: ''
        })
      });
    case DELETE_VARIATION_ITEM:
      return Object.assign({}, state, {
        variations: state.variations.delete(action.index)
      });
    case EDIT_VARIATION_ITEM:
      return Object.assign({}, state, {
        variations: state.variations.set(action.index, {
          name: action.name,
          value: action.value
        })
      });
    case ADD_CLIENT:
      return Object.assign({}, state, {
        clients: state.clients.push({
          name: '',
          value: ''
        })
      });
    case DELETE_CLIENT:
      return Object.assign({}, state, {
        clients: state.clients.delete(action.index)
      });
    case EDIT_CLIENT:
      return Object.assign({}, state, {
        clients: state.clients.set(action.index, {
          name: action.name,
          first: action.first,
          second: action.second
        })
      });
    case ADD_PROGRESS_ITEM:
      return Object.assign({}, state, {
        progressItems: state.progressItems.push({
          name: '',
          value: ''
        })
      });
    case DELETE_PROGRESS_ITEM:
      return Object.assign({}, state, {
        progressItems: state.progressItems.delete(action.index)
      });
    case EDIT_PROGRESS_ITEM:
      return Object.assign({}, state, {
        progressItems: state.progressItems.set(action.index, {
          name: action.name,
          value: action.value
        })
      });
    case UPDATE_MARGIN_AND_ADMIN_FEE:
      return Object.assign({}, state, {
        margin: action.margin
      });
    case UPDATE_TIME:
      return Object.assign({}, state, {
        time: action.time
      });
    case UPDATE_SUBCONTRACTOR:
      return Object.assign({}, state, {
        subcontractor: action.subcontractor
      });
    case UPDATE_INVOICE_NUMBER:
      return Object.assign({}, state, {
        invoiceNumber: action.invoiceNumber
      });
    case UPDATE_DESCRIPTION:
      return Object.assign({}, state, {
        description: action.description
      });
    case NEW_PROJECT_NAME:
      return Object.assign({}, state, {
        newName: action.newName
      });
    case NEW_PROJECT_REF_NUMBER:
      return Object.assign({}, state, {
        newRefNum: action.newRefNum
      });
    case NEW_PROJECT_MARGIN:
      return Object.assign({}, state, {
        newMargin: action.newMargin
      });
    case NEW_PROJECT_ADMIN_FEE:
      return Object.assign({}, state, {
        newAdminFee: action.newAdminFee
      });
    case LOAD_PROJECTS:
      return Object.assign({}, state, {
        projects: action.projects
      });
    case LOAD_PROJECT:
      return Object.assign({}, state, {
        project: action.project
      });
    case EDIT_PROJECT_NAME:
      return Object.assign({}, state, {
        editName: action.name
      });
    case EDIT_PROJECT_REF_NUMBER:
      return Object.assign({}, state, {
        editRefNum: action.refNumber
      });
    case EDIT_PROJECT_MARGIN:
      return Object.assign({}, state, {
        editMargin: action.margin
      });
    case EDIT_PROJECT_ADMIN_FEE:
      return Object.assign({}, state, {
        editAdminFee: action.adminFee
      });
    default:
      return state;
  }
}