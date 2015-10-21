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

export function addVariationItem(name, value) {
  'use strict';
  return {
    type: ADD_VARIATION_ITEM,
    name,
    value
  };
}

export function deleteVariationItem(index) {
  'use strict';
  return {
    type: ADD_VARIATION_ITEM,
    index
  };
}

export function editVariationItem(index, name, value) {
  'use strict';
  return {
    type: EDIT_VARIATION_ITEM,
    index,
    name,
    value
  };
}

export function addClient(name, first, second) {
  'use strict';
  return {
    type: ADD_CLIENT,
    name,
    first,
    second
  };
}

export function deleteClient(index) {
  'use strict';
  return {
    type: DELETE_CLIENT,
    index
  };
}

export function editClient(index, name, first, second) {
  'use strict';
  return {
    type: EDIT_CLIENT,
    index,
    name,
    first,
    second
  };
}

export function addProgressItem(name, value) {
  'use strict';
  return {
    type: ADD_PROGRESS_ITEM,
    name,
    value
  };
}

export function deleteProgressItem(index) {
  'use strict';
  return {
    type: DELETE_PROGRESS_ITEM,
    index
  };
}

export function editProgressItem(index, name, value) {
  'use strict';
  return {
    type: EDIT_PROGRESS_ITEM,
    index,
    name,
    value
  };
}

export function updateMarginAndAdminFee(id, margin, adminFee) {
  'use strict';
  return {
    type: UPDATE_MARGIN_AND_ADMIN_FEE,
    id,
    margin,
    adminFee
  };
}

export function updateTime(time) {
  'use strict';
  return {
    type: UPDATE_TIME,
    time
  };
}

export function updateSubcontractor(subcontractor) {
  'use strict';
  return {
    type: UPDATE_SUBCONTRACTOR,
    subcontractor
  };
}

export function updateInvoiceNumber(invoiceNumber) {
  'use strict';
  return {
    type: UPDATE_INVOICE_NUMBER,
    invoiceNumber
  };
}

export function updateDescription(description) {
  'use strict';
  return {
    type: UPDATE_DESCRIPTION,
    description
  };
}

export function newProjectName(newName) {
  'use strict';
  return {
    type: NEW_PROJECT_NAME,
    newName
  };
}

export function newProjectRefNumber(newRefNum) {
  'use strict';
  return {
    type: NEW_PROJECT_REF_NUMBER,
    newRefNum
  };
}

export function newProjectMargin(newMargin) {
  'use strict';
  return {
    type: NEW_PROJECT_MARGIN,
    newMargin
  };
}

export function newProjectAdminFee(newAdminFee) {
  'use strict';
  return {
    type: NEW_PROJECT_ADMIN_FEE,
    newAdminFee
  };
}

export function loadProjects(projects) {
  'use strict';
  return {
    type: LOAD_PROJECTS,
    projects
  };
}

export function loadProject(project) {
  'use strict';
  return {
    type: LOAD_PROJECT,
    project
  };
}

export function editProjectName(name) {
  'use strict';
  return {
    type: EDIT_PROJECT_NAME,
    name
  };
}
export function editProjectRefNumber(refNumber) {
  'use strict';
  return {
    type: EDIT_PROJECT_REF_NUMBER,
    refNumber
  };
}
export function editProjectMargin(margin) {
  'use strict';
  return {
    type: EDIT_PROJECT_MARGIN,
    margin
  };
}
export function editProjectAdminFee(adminFee) {
  'use strict';
  return {
    type: EDIT_PROJECT_ADMIN_FEE,
    adminFee
  };
}
