// Import your custom property entries.
// The entry is a text input field with logic attached to create,
// update and delete the "spell" property.
import customProperties from './properties/custom-properties';

import { is } from 'bpmn-js/lib/util/ModelUtil';

const LOW_PRIORITY = 500;


/**
 * A provider with a `#getGroups(element)` method
 * that exposes groups for a diagram element.
 *
 * @param {PropertiesPanel} propertiesPanel
 * @param {Function} translate
 */
class CustomPropertiesProvider {
  static $inject = [ 'propertiesPanel', 'translate' ]
  propertiesPanel: any;
  translate: any;

  constructor(propertiesPanel: any, translate: any) {
    this.propertiesPanel = propertiesPanel;
    this.translate = translate;

    // registration ////////

    // Register our custom magic properties provider.
    // Use a lower priority to ensure it is loaded after
    // the basic BPMN properties.
    propertiesPanel.registerProvider(LOW_PRIORITY, this);
  }


  // API ////////

  /**
   * Return the groups provided for the given element.
   *
   * @param {DiagramElement} element
   *
   * @return {(Object[]) => (Object[])} groups middleware
   */
  getGroups(element: any) {
    const translate = this.translate;

    /**
     * We return a middleware that modifies
     * the existing groups.
     *
     * @param {Object[]} groups
     *
     * @return {Object[]} modified groups
     */
    return function(groups: any) {
      // Add the "magic" group
      if(is(element, 'bpmn:StartEvent')) {
        groups.push(createCustomGroup(element, translate));
      }

      return groups;
    }
  };
}

// (CustomPropertiesProvider as unknown as any).$inject = [ 'propertiesPanel', 'translate' ];

// Create the custom magic group
function createCustomGroup(element: any, translate: any) {

  // create a group called "Custom properties".
  const customGroup = {
    id: 'custom',
    label: translate('Custom properties'),
    entries: customProperties(element)
  };

  return customGroup;
}


export default {
  __init__: [ 'customPropertiesProvider' ],
  customPropertiesProvider: [ 'type', CustomPropertiesProvider ]
};
