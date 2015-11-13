import React from 'react';

import Menu from './Menu';
import NewProjectForm from './NewProjectForm';
import NewVariationForm from './NewVariationForm';
import ProjectList from './ProjectList';

class FrontPage extends React.Component {
  render() {
    return (
      <div>
        <Menu />
        <div className="container">
          <ProjectList />
        </div>
        <NewProjectForm />
        <NewVariationForm />
      </div>
    );
  }
}

export default FrontPage;

