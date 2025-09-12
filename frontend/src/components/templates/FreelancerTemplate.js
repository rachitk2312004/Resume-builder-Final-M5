import React from 'react';
import MinimalTemplate from './MinimalTemplate';

const FreelancerTemplate = ({ data, isPreview = false }) => {
  // Freelancer template extends Minimal template
  return <MinimalTemplate data={data} isPreview={isPreview} />;
};

export default FreelancerTemplate;
