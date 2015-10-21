import React from 'react';

import Menu from './Menu';
import ProjectList from './ProjectList';
import NewProjectForm from './NewProjectForm';
import NewVariationForm from './NewVariationForm';

class FrontPage extends React.Component {
  render() {
    return (
      <div>
        <Menu/>
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
