import React from 'react';
import DOMPurify from 'dompurify';

interface HTMLContentProps {
  htmlContent: string;
}

const HTMLContent: React.FC<HTMLContentProps> = ({ htmlContent }) => {
  const sanitizedHTML = DOMPurify.sanitize(htmlContent);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
};

export default HTMLContent;
