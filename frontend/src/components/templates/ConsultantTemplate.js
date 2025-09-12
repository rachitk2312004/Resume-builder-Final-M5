import React from 'react';
import ModernTemplate from './ModernTemplate';

const ConsultantTemplate = ({ data, isPreview = false }) => {
  // Consultant template extends Modern template
  return <ModernTemplate data={data} isPreview={isPreview} />;
};

export default ConsultantTemplate;
