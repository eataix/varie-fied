import _ from 'lodash';

const metaData = $('#meta-data').data();
//noinspection JSUnresolvedVariable
export const newProjectUrl = metaData.newProjectUrl;
//noinspection JSUnresolvedVariable
export const newVariationUrl = metaData.newVariationUrl;
//noinspection JSUnresolvedVariable
export const newItemUrl = metaData.newItemUrl;
//noinspection JSUnresolvedVariable
export const newClientUrl = metaData.newClientUrl;
//noinspection JSUnresolvedVariable
export const newProgressItemUrl = metaData.newProgressItemUrl;
//noinspection JSUnresolvedVariable
export const projectsUrl = metaData.projectsUrl;

const projectData = $('#project-data').data();
//noinspection JSUnresolvedVariable
export const projectId = _.isUndefined(projectData) ? null : projectData.projectId;
//noinspection JSUnresolvedVariable
export const projectName = _.isUndefined(projectData) ? null : projectData.projectName;
//noinspection JSUnresolvedVariable,JSUnusedGlobalSymbols
export const projectActive = _.isUndefined(projectData) ? null : projectData.projectActive === 'True';
//noinspection JSUnresolvedVariable
export const projectMargin = _.isUndefined(projectData) ? null : parseFloat(projectData.projectMargin);
//noinspection JSUnresolvedVariable
export const projectAdminFee = _.isUndefined(projectData) ? null : ($.isNumeric(projectData.projectAdminFee) ? parseFloat(projectData.projectAdminFee) : 0);

//noinspection JSUnresolvedVariable
export const getProjectProgressItemsUrl = _.isUndefined(projectData) ? null : projectData.getProjectProgressItemsUrl;
//noinspection JSUnresolvedVariable
export const getProjectVariationsUrl = _.isUndefined(projectData) ? null : projectData.getProjectVariationsUrl;

//noinspection JSUnresolvedVariable
export const editProjectUrl = _.isUndefined(projectData) ? null : projectData.editProjectUrl;
//noinspection JSUnresolvedVariable
export const deleteProjectUrl = _.isUndefined(projectData) ? null : projectData.deleteProjectUrl;

export const isNull = (e) => {
  return _.isNull(e);
};

export const isTrue = (e) => {
  return e === true;
};

export const isFalse = (e) => {
  return e === false;
};

