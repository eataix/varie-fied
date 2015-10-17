import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';

import Menu from './Menu';
import ProjectList from './ProjectList';

import NewProjectForm from './NewProjectForm';
import NewVariationForm from './NewVariationForm';

const list_all_projects_url = $('#meta-data').data().projectsUrl;

export default class FrontPage extends React.Component {
  render() {
    return (
      <div>
        <Menu
          project_url={list_all_projects_url}
          pollInterval={2000}
        />
        <div className='container'>
          <ProjectList />
        </div>
        <NewProjectForm />
        <NewVariationForm />
      </div>
    );
  }
}
