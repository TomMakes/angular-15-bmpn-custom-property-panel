import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

export default function(element: any) {

  return [
    {
      id: 'custom',
      element,
      component: Custom,
      isEdited: isTextFieldEntryEdited
    }
  ];
}

function Custom(props: any) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    return element.businessObject.custom || '';
  }

  const setValue = (value: any) => {
    return modeling.updateProperties(element, {
      custom: value
    });
  }

  const title = translate('Custom property');
  const description = translate('Custom property description')
  return new TextFieldEntry({
    id,
    element,
    getValue,
    setValue,
    debounce,
    title,
    description
  });
}
