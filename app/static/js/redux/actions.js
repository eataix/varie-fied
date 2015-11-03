export const ADD_VARIATION_ITEM = 'ADD_VARIATION_ITEM';
export const DELETE_VARIATION_ITEM = 'DELETE_VARIATION_ITEM';
export const EDIT_VARIATION_ITEM = 'EDIT_VARIATION_ITEM';

export const ADD_CLIENT = 'ADD_CLIENT';
export const DELETE_CLIENT = 'DELETE_CLIENT';
export const EDIT_CLIENT = 'EDIT_CLIENT';

export const ADD_PROGRESS_ITEM = 'ADD_PROGRESS_ITEM';
export const DELETE_PROGRESS_ITEM = 'DELETE_PROGRESS_ITEM';
export const EDIT_PROGRESS_ITEM = 'EDIT_PROGRESS_ITEM';

export const UPDATE_MARGIN_AND_ADMIN_FEE = 'UPDATE_MARGIN_AND_ADMIN_FEE';
export const UPDATE_TIME = 'UPDATE_TIME';
export const UPDATE_SUBCONTRACTOR = 'UPDATE_SUBCONTRACTOR';
export const UPDATE_INVOICE_NUMBER = 'UPDATE_INVOICE_NUMBER';
export const UPDATE_DESCRIPTION = 'UPDATE_DESCRIPTION';
export const UPDATE_PREPARED_FOR = 'UPDATE_PREPARED_FOR';

export const NEW_PROJECT_NAME = 'NEW_PROJECT_NAME';
export const NEW_PROJECT_REF_NUMBER = 'NEW_PROJECT_REF_NUMBER';
export const NEW_PROJECT_MARGIN = 'NEW_PROJECT_MARGIN';
export const NEW_PROJECT_ADMIN_FEE = 'NEW_PROJECT_ADMIN_FEE';

export const LOAD_PROJECTS = 'LOAD_PROJECTS';
export const LOAD_PROJECT = 'LOAD_PROJECT';

export const EDIT_PROJECT_NAME = 'EDIT_PROJECT_NAME';
export const EDIT_PROJECT_REF_NUMBER = 'EDIT_PROJECT_REF_NUMBER';
export const EDIT_PROJECT_MARGIN = 'EDIT_PROJECT_MARGIN';
export const EDIT_PROJECT_ADMIN_FEE = 'EDIT_PROJECT_ADMIN_FEE';

export const addVariationItem = (name = '', value = '') => {
  return {
    type: ADD_VARIATION_ITEM,
    name,
    value
  };
};

export const deleteVariationItem = (index) => {
  return {
    type: DELETE_VARIATION_ITEM,
    index
  };
};

export const editVariationItem = (index, name, value) => {
  return {
    type: EDIT_VARIATION_ITEM,
    index,
    name,
    value
  };
};

export const addClient = (name = '', first = '', second = '') => {
  return {
    type: ADD_CLIENT,
    name,
    first,
    second
  };
};

export const deleteClient = (index) => {
  return {
    type: DELETE_CLIENT,
    index
  };
};

export const editClient = (index, name, first, second) => {
  return {
    type: EDIT_CLIENT,
    index,
    name,
    first,
    second
  };
};

export const addProgressItem = (name = '', value = '') => {
  return {
    type: ADD_PROGRESS_ITEM,
    name,
    value
  };
};

export const deleteProgressItem = (index) => {
  return {
    type: DELETE_PROGRESS_ITEM,
    index
  };
};

export const editProgressItem = (index, name, value) => {
  return {
    type: EDIT_PROGRESS_ITEM,
    index,
    name,
    value
  };
};

export const updateMarginAndAdminFee = (id, margin, adminFee) => {
  return {
    type: UPDATE_MARGIN_AND_ADMIN_FEE,
    id,
    margin,
    adminFee
  };
};

export const updateTime = (time) => {
  return {
    type: UPDATE_TIME,
    time
  };
};

export const updateSubcontractor = (subcontractor) => {
  return {
    type: UPDATE_SUBCONTRACTOR,
    subcontractor
  };
};

export const updateInvoiceNumber = (invoiceNumber) => {
  return {
    type: UPDATE_INVOICE_NUMBER,
    invoiceNumber
  };
};

export const updateDescription = (description) => {
  return {
    type: UPDATE_DESCRIPTION,
    description
  };
};

export const updatePreparedFor = (preparedFor) => {
  return {
    type: UPDATE_PREPARED_FOR,
    preparedFor
  };
};

export const newProjectName = (newName) => {
  return {
    type: NEW_PROJECT_NAME,
    newName
  };
};

export const newProjectRefNumber = (newRefNum) => {
  return {
    type: NEW_PROJECT_REF_NUMBER,
    newRefNum
  };
};

export const newProjectMargin = (newMargin) => {
  return {
    type: NEW_PROJECT_MARGIN,
    newMargin
  };
};

export const newProjectAdminFee = (newAdminFee) => {
  return {
    type: NEW_PROJECT_ADMIN_FEE,
    newAdminFee
  };
};

export const loadProjects = (projects) => {
  return {
    type: LOAD_PROJECTS,
    projects
  };
};

export const loadProject = (project) => {
  return {
    type: LOAD_PROJECT,
    project
  };
};

export const editProjectName = (name) => {
  return {
    type: EDIT_PROJECT_NAME,
    name
  };
};

export const editProjectRefNumber = (refNumber) => {
  return {
    type: EDIT_PROJECT_REF_NUMBER,
    refNumber
  };
};

export const editProjectMargin = (margin) => {
  return {
    type: EDIT_PROJECT_MARGIN,
    margin
  };
};

export const editProjectAdminFee = (adminFee) => {
  return {
    type: EDIT_PROJECT_ADMIN_FEE,
    adminFee
  };
};

