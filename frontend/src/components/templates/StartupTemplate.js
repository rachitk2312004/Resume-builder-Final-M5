import React from 'react';
import ModernTemplate from './ModernTemplate';

const StartupTemplate = ({ data, isPreview = false }) => {
  // Startup template extends Modern template with startup styling
  return <ModernTemplate data={data} isPreview={isPreview} />;
};

export default StartupTemplate;
