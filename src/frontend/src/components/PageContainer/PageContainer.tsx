import React from 'react';
import Header from './Header';
import TotalContainer from './TotalContainer';
import Footer from './Footer';
import styles from './PageContainer.module.css';

const PageContainer: React.FC = () => {
  return (
    <div className={styles.PageContainer}>
      <Header />
      <TotalContainer />
      <Footer />
    </div>
  );
};

export default PageContainer;
