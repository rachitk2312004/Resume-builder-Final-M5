import React from 'react';
import MinimalTemplate from './MinimalTemplate';

const AcademicTemplate = ({ data, isPreview = false }) => {
  // Academic template extends Minimal template
  return <MinimalTemplate data={data} isPreview={isPreview} />;
};

export default AcademicTemplate;
