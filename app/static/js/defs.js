const metaData = $('#meta-data').data();
export const newProjectUrl = metaData.newProjectUrl;
export const newVariationUrl = metaData.newVariationUrl;
export const newItemUrl = metaData.newItemUrl;
export const newClientUrl = metaData.newClientUrl;
export const newProgressItemUrl = metaData.newProgressItemUrl;
export const projectsUrl = metaData.projectsUrl;

const projectData = $('#project-data').data();
export const projectId = _.isUndefined(projectData) ? null : projectData.projectId;
export const projectName = _.isUndefined(projectData) ? null : projectData.projectName;
export const projectActive = _.isUndefined(projectData) ? null : projectData.projectActive === 'True';
export const projectMargin = _.isUndefined(projectData) ? null : parseFloat(projectData.projectMargin);
export const projectAdminFee = _.isUndefined(projectData) ? null : ($.isNumeric(projectData.projectAdminFee) ? parseFloat(projectData.projectAdminFee) : 0);

export const getProjectProgressItemsUrl = _.isUndefined(projectData) ? null : projectData.getProjectProgressItemsUrl;
export const getProjectVariationsUrl = _.isUndefined(projectData) ? null : projectData.getProjectVariationsUrl;

export const editProjectUrl = _.isUndefined(projectData) ? null : projectData.editProjectUrl;
export const deleteProjectUrl = _.isUndefined(projectData) ? null : projectData.deleteProjectUrl;

export const isNull = (e) => {
  'use strict';
  return e === null;
};

export const isTrue = (e) => {
  'use strict';
  return e === true;
};

export const isFalse = (e) => {
  'use strict';
  return e === false;
};

