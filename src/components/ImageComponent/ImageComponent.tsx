import React from 'react';
import './styles.css';

interface ImageComponentProps {
  src: string;
  alt: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ src, alt }) => {
  return <img src={src} alt={alt} width="100%" height="180px" className="ImageComponent" />;
};

export default React.memo(ImageComponent);