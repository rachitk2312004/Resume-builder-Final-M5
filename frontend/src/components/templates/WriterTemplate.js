import React from 'react';
import MinimalTemplate from './MinimalTemplate';

const WriterTemplate = ({ data, isPreview = false }) => {
  // Writer template extends Minimal template
  return <MinimalTemplate data={data} isPreview={isPreview} />;
};

export default WriterTemplate;
