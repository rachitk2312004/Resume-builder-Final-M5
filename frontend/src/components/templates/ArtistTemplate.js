import React from 'react';
import CreativeTemplate from './CreativeTemplate';

const ArtistTemplate = ({ data, isPreview = false }) => {
  // Artist template extends Creative template
  return <CreativeTemplate data={data} isPreview={isPreview} />;
};

export default ArtistTemplate;
