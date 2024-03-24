import React from 'react';

interface ConditionProps {
  variable: string;
  value: any;
  children: React.ReactNode;
  variables: Record<string, any>;
}

const Condition: React.FC<ConditionProps> = ({ variable, value, children, variables }) => {
  return Object.values(variables).length === 0 ? <>{children}</> : variables[variable] === value ? <>{children}</> : null;
};

export default React.memo(Condition);