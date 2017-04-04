import Immutable from "immutable";

import {
    ADD_PROGRESS_ITEM,
    ADD_VARIATION_ITEM,
    DELETE_PROGRESS_ITEM,
    DELETE_VARIATION_ITEM,
    EDIT_CLIENT,
    EDIT_PROGRESS_ITEM,
    EDIT_PROJECT_ADMIN_FEE,
    EDIT_PROJECT_MARGIN,
    EDIT_PROJECT_NAME,
    EDIT_PROJECT_REF_NUMBER,
    EDIT_SUPERINTENDENT,
    EDIT_VARIATION_ITEM,
    LOAD_PROJECT,
    LOAD_PROJECTS,
    NEW_PROJECT_ADMIN_FEE,
    NEW_PROJECT_MARGIN,
    NEW_PROJECT_NAME,
    NEW_PROJECT_REF_NUMBER,
    UPDATE_DESCRIPTION,
    UPDATE_INVOICE_NUMBER,
    UPDATE_MARGIN_AND_ADMIN_FEE,
    UPDATE_PREPARED_FOR,
    UPDATE_SUBCONTRACTOR,
    UPDATE_TIME
} from "./actions";
import _ from "lodash";
const initialState = {
    variations: Immutable.List([{
        name: '',
        value: ''
    }]),
    client: {
        name: '',
        first: '',
        second: ''
    },
    superintendent: {
        name: '',
        first: '',
        second: ''
    },
    progressItems: Immutable.List([{
        name: '',
        value: ''
    }]),
    id: -1,
    margin: '',
    adminFee: null,
    time: '',
    subcontractor: '',
    invoiceNumber: '',
    description: '',
    preparedFor: '',
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

const app = (state = initialState, action) => {
    console.log(action); // eslint-disable-line no-console
    switch (action.type) {
        case ADD_VARIATION_ITEM:
            return Object.assign({}, state, {
                variations: state.variations.push({
                    name: action.name,
                    value: action.value
                })
            });
        case DELETE_VARIATION_ITEM:
            if (state.variations.size === 1) {
                return state;
            } else {
                return Object.assign({}, state, {
                    variations: state.variations.delete(action.index)
                });
            }
            break;
        case EDIT_VARIATION_ITEM:
            return Object.assign({}, state, {
                variations: state.variations.set(action.index, {
                    name: action.name,
                    value: action.value
                })
            });
        case EDIT_CLIENT:
            return Object.assign({}, state, {
                client: {
                    name: action.name,
                    first: action.first,
                    second: action.second
                }
            });
        case EDIT_SUPERINTENDENT:
            return Object.assign({}, state, {
                superintendent: {
                    name: action.name,
                    first: action.first,
                    second: action.second
                }
            });
        case ADD_PROGRESS_ITEM:
            return Object.assign({}, state, {
                progressItems: state.progressItems.push({
                    name: action.name,
                    value: action.value
                })
            });
        case DELETE_PROGRESS_ITEM:
            if (state.progressItems.size === 1) {
                return state;
            } else {
                return Object.assign({}, state, {
                    progressItems: state.progressItems.delete(action.index)
                });
            }
            break;
        case EDIT_PROGRESS_ITEM:
            return Object.assign({}, state, {
                progressItems: state.progressItems.set(action.index, {
                    name: action.name,
                    value: action.value
                })
            });
        case UPDATE_MARGIN_AND_ADMIN_FEE:
            return Object.assign({}, state, {
                id: action.id,
                margin: action.margin,
                adminFee: action.adminFee
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
        case UPDATE_PREPARED_FOR:
            return Object.assign({}, state, {
                preparedFor: action.preparedFor
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
            if (_.isNull(state.project)) {
                return Object.assign({}, state, {
                    project: action.project,
                    editName: action.project.name,
                    editRefNum: action.project.reference_number,
                    editMargin: action.project.margin.toString(),
                    editAdminFee: _.isNull(action.project.admin_fee) ? '' : action.project.admin_fee.toString()
                });
            } else {
                return Object.assign({}, state, {
                    project: action.project
                });
            }
            break;
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
};

export default app;

