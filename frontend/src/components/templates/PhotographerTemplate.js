import React from 'react';
import CreativeTemplate from './CreativeTemplate';

const PhotographerTemplate = ({ data, isPreview = false }) => {
  // Photographer template extends Creative template
  return <CreativeTemplate data={data} isPreview={isPreview} />;
};

export default PhotographerTemplate;
