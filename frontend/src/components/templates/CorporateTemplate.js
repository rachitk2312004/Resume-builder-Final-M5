import React from 'react';
import ModernTemplate from './ModernTemplate';

const CorporateTemplate = ({ data, isPreview = false }) => {
  // Corporate template extends Modern template with corporate styling
  return <ModernTemplate data={data} isPreview={isPreview} />;
};

export default CorporateTemplate;
