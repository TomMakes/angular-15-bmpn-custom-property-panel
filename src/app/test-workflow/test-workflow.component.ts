import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import Modeler from 'bpmn-js/lib/Modeler';
import { ImportDoneEvent, ImportXMLResult } from 'bpmn-js/lib/BaseViewer';
import type Canvas from 'diagram-js/lib/core/Canvas';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule
} from 'bpmn-js-properties-panel';
import customPropertiesProvider from './custom-properties-provider/custom-property-provider';
import custom from'./custom-properties-provider/descriptors/custom.json';
import { from, Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-test-workflow',
  templateUrl: './test-workflow.component.html',
  styleUrls: ['./test-workflow.component.scss']
})
export class TestWorkflowComponent implements AfterViewInit, OnChanges, OnDestroy {

  @ViewChild('diagramRef', { static: true }) private diagramRef: ElementRef | undefined;
  @ViewChild('propertiesRef', { static: true }) private propertiesRef: ElementRef | undefined;
  @Input() private url?: string;
  @Output() private importDone: EventEmitter<any> = new EventEmitter();
  private bpmnJS!: Modeler;
  // keep in mind, only xml/bpmn files included in the assets folder are bundled properly for web/Angular to access.
  private diagramFilePath = './assets/bpmn/test-diag.bpmn';
  private diagramUrl = 'https://cdn.statically.io/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';

  // DROPPED private uinService: UINotificationService
  // may add back later
  constructor(private http: HttpClient ) {
  }

  ngAfterViewInit(): void {
    // setTimeout is used to ensure html elements are rendered before initializing bpmnJS
    setTimeout(() => {
      console.log(document.querySelector('li[data-qa="home-sidebar-org-dashboard"]'));
      console.log(document.querySelector('#js-canvas'));
      console.log(document.querySelector('#js-properties-panel'));
      this.bpmnJS = new Modeler({
        container: this.diagramRef?.nativeElement,
        propertiesPanel: {
          parent: this.propertiesRef?.nativeElement,
        },
        additionalModules: [
          BpmnPropertiesPanelModule,
          BpmnPropertiesProviderModule,
          customPropertiesProvider
        ],
        moddleExtensions: {
          custom
        }
      })
      this.bpmnJS.on<ImportDoneEvent>('import.done', ({ error }) => {
        if (!error) {
          this.bpmnJS.get<Canvas>('canvas').zoom('fit-viewport');
        }
      });

      this.bpmnJS.attachTo(this.diagramRef!.nativeElement);
      const propertiesPanel: any = this.bpmnJS.get('propertiesPanel');
      propertiesPanel.attachTo(this.propertiesRef!.nativeElement);

      // Grab bpmn test file and import
      this.loadXMLFile(this.diagramFilePath, (xmlData) => this.importDiagram(xmlData));
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // re-import whenever the url changes
    if (changes['url']) {
      this.loadUrl(changes['url'].currentValue);
    }
  }

  ngOnDestroy(): void {
    this.bpmnJS.destroy();
  }

  /**
   * Load diagram from URL and emit completion event
   */
  loadUrl(url: string): Subscription {
    return (
      this.http.get(url, { responseType: 'text' }).pipe(
        switchMap((xml: string) => this.importDiagram(xml)),
        map(result => result.warnings),
      ).subscribe(
        (warnings) => {
          this.importDone.emit({
            type: 'success',
            warnings
          });
        },
        (err) => {
          this.importDone.emit({
            type: 'error',
            error: err
          });
        }
      )
    );
  }

  /**
   * Load diagram from local XML file
   */
  loadXMLFile(filePath, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const xmlData = xhr.responseText;
          callback(xmlData);
        } else {
          console.error('Error loading XML file:', xhr.status);
        }
      }
    };
    xhr.open('GET', filePath, true);
    xhr.responseType = 'text';
    xhr.send();
  }

  /**
   * Creates a Promise to import the given XML into the current
   * BpmnJS instance, then returns it as an Observable.
   *
   * @see https://github.com/bpmn-io/bpmn-js-callbacks-to-promises#importxml
   */
  private importDiagram(xml: string): Observable<ImportXMLResult> {
    return from(this.bpmnJS.importXML(xml));
  }

  /**
   * Save diagram contents and print them to the console.
   */
  async exportDiagram() {
    try {
      const result = await this.bpmnJS.saveXML({ format: true });
      // this.uinService.displayNotification('Diagram exported. Check the console log!', SNACKBAR_DEACTIVATION_TIME);

      console.log('DIAGRAM', result.xml);
    } catch (err) {

      console.error('could not save BPMN 2.0 diagram', err);
    }
  }

}
