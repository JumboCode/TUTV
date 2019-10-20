import React from 'react';
import Header from './Header';
import TotalContainer from './TotalContainer';
import Footer from './Footer';

const PageContainer: React.FC = () => {
  return (
    <React.Fragment>
      <Header />
      <TotalContainer />
      <Footer />
    </React.Fragment>
  );
};

export default PageContainer;
