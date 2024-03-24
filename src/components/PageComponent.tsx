// components/PageComponent.tsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import ImageComponent from './ImageComponent/ImageComponent';
import WeatherComponent from './WeatherComponent/WeatherComponent';
import ButtonComponent from './ButtonComponent/ButtonComponent';
import ConditionComponent from './ConditionComponent';
import VariableComponent from './VariableComponent';

interface ComponentList {
  id: number;
  components: number[];
};

interface Component {
  id: number;
  type: string;
  options: { [key: string]: any };
  children: number;
}

interface Variable {
  name: string;
  type: string;
  initialValue: string | number | boolean;
}

interface PageComponentProps {
  id: string;
}

type ArrayRef<T> = React.MutableRefObject<T[]>;

type NumberArrayRef = ArrayRef<number> & { includes: (value: number) => boolean };

const PageComponent: React.FC<PageComponentProps> = ({ id }) => {
  const [components, setComponents] = useState<Component[]>([]);
  const [variables, setVariables] = useState<{ [key: string]: any }>({});
  const [compList, setCompList] = useState<ComponentList[]>([]);
  const [loading, setLoading] = useState<Boolean>(false);
  const [errorMsg, setErroMsg] = useState<String>('');
  const [childComponents, setChildComponents] = useState<Component[]>([]);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3030/page/${id}`);
        const {data} = await response.json();
        setCompList(data.lists)
        const conditionComponents = data.components.filter((comp: Component) => comp.type === 'condition')
        const conditionComponentsChildren: Component[] = [];
        conditionComponents.forEach((condition: Component) => {
          handleChildComponents(data.components, data.lists, condition).forEach(com => conditionComponentsChildren.push(com))
        })
        setChildComponents(conditionComponentsChildren);
        const updatedComponents = data.components.filter((component: Component) => !conditionComponentsChildren.find((condComp: Component) => condComp.id === component.id))
        setComponents(updatedComponents);
        const initialVariables: { [key: string]: any } = {};
        if (data.variables) {
          data.variables.forEach((variable: Variable) => {
            initialVariables[variable.name] = variable.initialValue;
          });
          setVariables(initialVariables);
        }
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (err: any) {
        setLoading(false);
        console.error('Error fetching page data:', err);
        setErroMsg(err.error)
      }
    };

    fetchPageData();
  }, [id]);

  const handleChildComponents = useCallback((components: Component[], compList: ComponentList[], component: Component) => {
    const [matchedComponents] = compList.filter((c) => component.children === c.id)
    let filteredComponents: Component[] = [];
    matchedComponents.components.forEach(comp => {
      filteredComponents.push(components.filter(c => c.id === comp)[0])
    })
    return filteredComponents;
  }, []);

  const renderComponent = useCallback((childComponents: Component[], compList: ComponentList[], component: Component, variables: Record<string, any>, updateVariable: (name: string, value: string) => void) => {
    switch (component.type) {
      case 'image':
        return <ImageComponent src={component.options.src} alt={component.options.alt} />;
      case 'weather':
        return <WeatherComponent lat={component.options.lat} lon={component.options.lon} />;
      case 'button':
        return (
          <ButtonComponent
            key={component.id}
            onClick={() => updateVariable(component.options.variable, component.options.value)}
            text={component.options.text}
            value={component.options.value}
            variable={component.options.variable}
          />
        );
      case 'condition':
        const filteredComponents = handleChildComponents(childComponents, compList, component)
        return (
          <ConditionComponent
            key={component.id}
            variable={component.options.variable}
            value={component.options.value}
            variables={variables}
          >
            <div className="abcd">
            {filteredComponents
              .map((childComponent) => renderComponent(childComponents, compList, childComponent, variables, updateVariable))}
            </div>
          </ConditionComponent>
        );
      default:
        return null;
    }
  }, [handleChildComponents]);

  return (
    <div>
      {errorMsg && <h3>{errorMsg}</h3>}
      {loading ? <h3 style={{ textAlign: 'center'}}>Loading Page...</h3> : (
        <VariableComponent initialVariables={variables}>
          {(variables, updateVariable) => (
            <div>
              {components.map((component) => renderComponent(childComponents, compList, component, variables, updateVariable))}
            </div>
          )}
        </VariableComponent>
      )}
    </div>
  );
};

export default React.memo(PageComponent);
