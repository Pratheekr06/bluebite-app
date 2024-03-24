import React from 'react';
import './styles.css';

interface ButtonProps {
  onClick: () => void;
  text: string;
  value: string;
  variable: string;
}

const handleIcon = (variable: string, value: string) => {
  if (variable.includes('show')) {
    if (value === 'show') return 'visibility'
    else return 'visibility_off'
  } else {
    return "location_on"
  }
}

const ButtonComponent: React.FC<ButtonProps> = ({ onClick, text, value, variable }) => {
  return <div className="ButtonComponent" onClick={onClick}>
    <p>{text}</p>
    <span className="material-symbols-rounded">{handleIcon(variable, value)}</span>
  </div>;
};

export default React.memo(ButtonComponent);