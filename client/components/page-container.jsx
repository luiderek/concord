import React from 'react';

const styles = {
  page: {
    minHeight: 'calc(100vh - 1rem)'
  }
};

export default function PageContainer({ children }) {
  return (
      <div className="container" style={styles.page}>
        { children }
      </div>
  );
}
