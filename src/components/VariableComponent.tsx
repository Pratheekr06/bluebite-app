import React, { useState } from 'react';

interface VariableComponentProps {
  initialVariables: Record<string, any>;
  children: (variables: Record<string, any>, updateVariable: (arg0: string, arg1: string) => void) => JSX.Element
}

const VariableComponent: React.FC<VariableComponentProps> = ({ initialVariables, children }) => {
  const [variables, setVariables] = useState(initialVariables);

  const updateVariable = (name: string, value: any) => {
    setVariables((prevVariables) => ({
      ...prevVariables,
      [name]: value,
    }));
  };

  return <>{children(variables, updateVariable)}</>;
};

export default React.memo(VariableComponent);