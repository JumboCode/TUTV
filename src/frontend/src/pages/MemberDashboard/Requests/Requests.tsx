import React from 'react';
import Button from '../../../components/Button';

type ProjectBoxProps = {
  projectName: string;
  children: React.ReactNode;
  // project: Project;
};

type Project = {
  name: string;
  people: string[];
};

const ProjectBox: React.FC<ProjectBoxProps> = ({ projectName, children }) => {
  return (
    <div>
      {projectName}
      {children}
      {/* {project.name} */}
      {/* {project.people} */}
      <Button onClick={() => null}>view</Button>
    </div>
  );
};

const Requests: React.FC = () => {
  const arr = [1, 2, 3];
  return (
    <div>
      {arr.map(val => (
        <div>
          <ProjectBox projectName={`Project ${val}`}> </ProjectBox>
        </div>
      ))}
    </div>
  );
};

export default Requests;
