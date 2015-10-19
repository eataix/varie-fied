import React from 'react';
import { connect } from 'react-redux';

import Menu from './Menu';
import ProjectList from './ProjectList';

import NewProjectForm from './NewProjectForm';
import NewVariationForm from './NewVariationForm';

class FrontPage extends React.Component {
  render() {
    return (
      <div>
        <Menu pollInterval={2000}/>
        <div className='container'>
          <ProjectList />
        </div>
        <NewProjectForm />
        <NewVariationForm />
      </div>
    );
  }
}

export default FrontPage;
