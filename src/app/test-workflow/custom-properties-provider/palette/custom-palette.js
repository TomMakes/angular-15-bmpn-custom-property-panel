import { emailPaletteImg } from "./email-img";


export default class CustomPalette {
  constructor(create, elementFactory, palette, translate) {
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const {
      create,
      elementFactory,
      translate
    } = this;

    function createSendTask(event) {
      const shape = elementFactory.create( 'shape', { type: 'bpmn:SendTask' });

      console.log(emailPaletteImg.dataURL);

      create.start(event, shape);
    }

    return {
      'create.send-task': {
        group: 'activity',
        // className: 'bpmn-icon-send-task',
        title: translate('Create Email Task'),
        imageURL: emailPaletteImg.dataURL,
        action: {
          dragstart: createSendTask,
          click: createSendTask
        }
      },
    }
  }
}

CustomPalette.$inject = [
  'create',
  'elementFactory',
  'palette',
  'translate'
];
