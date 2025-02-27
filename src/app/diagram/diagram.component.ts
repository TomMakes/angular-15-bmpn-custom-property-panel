import {AfterContentInit, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule
} from 'bpmn-js-properties-panel';
import Modeler from 'bpmn-js/lib/Modeler';
import customPropertiesProvider from './custom-properties-provider/custom-property-provider';
import {from, Observable} from 'rxjs';

import custom from'./custom-properties-provider/descriptors/custom.json';
// const custom = require('./custom-properties-provider/descriptors/custom.json');
/**
 * You may include a different variant of BpmnJS:
 *
 * bpmn-viewer  - displays BPMN diagrams without the ability
 *                to navigate them
 * bpmn-modeler - bootstraps a full-fledged BPMN editor
 */
// const BpmnJS = require('bpmn-js/dist/bpmn-modeler.production.min.js');

@Component({
    selector: 'app-diagram',
    templateUrl: 'diagram.component.html',
    styleUrls: [
        'diagram.component.scss'
    ]
})
export class DiagramComponent implements AfterContentInit, OnDestroy {

  // instantiate BpmnJS with component
  private bpmnJS: Modeler;

  // retrieve DOM element reference
  @ViewChild('diagramRef', { static: true }) private diagramRef: ElementRef | undefined;
  @ViewChild('propertiesRef', { static: true }) private propertiesRef: ElementRef | undefined;

  private xml: string = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" targetNamespace="" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL http://www.omg.org/spec/BPMN/2.0/20100501/BPMN20.xsd">
  <collaboration id="sid-c0e745ff-361e-4afb-8c8d-2a1fc32b1424">
    <participant id="sid-87F4C1D6-25E1-4A45-9DA7-AD945993D06F" name="Test Flow" processRef="sid-C3803939-0872-457F-8336-EAE484DC4A04" />
  </collaboration>
  <process id="sid-C3803939-0872-457F-8336-EAE484DC4A04" name="Customer" processType="None" isClosed="false" isExecutable="false">
    <extensionElements />
    <laneSet id="sid-b167d0d7-e761-4636-9200-76b7f0e8e83a">
      <lane id="sid-57E4FE0D-18E4-478D-BC5D-B15164E93254">
        <flowNodeRef>Event_02ttpvf</flowNodeRef>
        <flowNodeRef>Gateway_1nm0nug</flowNodeRef>
        <flowNodeRef>Event_15rnn61</flowNodeRef>
        <flowNodeRef>Event_1yw13up</flowNodeRef>
        <flowNodeRef>Event_0fk5zj7</flowNodeRef>
      </lane>
    </laneSet>
    <startEvent id="Event_02ttpvf" name="Start of flow">
      <outgoing>Flow_1vvkcwz</outgoing>
    </startEvent>
    <exclusiveGateway id="Gateway_1nm0nug" name="Decision">
      <incoming>Flow_1vvkcwz</incoming>
      <outgoing>Flow_00rdo5n</outgoing>
      <outgoing>Flow_03js57d</outgoing>
    </exclusiveGateway>
    <sequenceFlow id="Flow_1vvkcwz" sourceRef="Event_02ttpvf" targetRef="Gateway_1nm0nug" />
    <intermediateThrowEvent id="Event_15rnn61" name="Yes">
      <incoming>Flow_00rdo5n</incoming>
      <outgoing>Flow_01nosus</outgoing>
    </intermediateThrowEvent>
    <intermediateThrowEvent id="Event_1yw13up" name="No">
      <incoming>Flow_03js57d</incoming>
      <outgoing>Flow_1b23zab</outgoing>
    </intermediateThrowEvent>
    <sequenceFlow id="Flow_00rdo5n" sourceRef="Gateway_1nm0nug" targetRef="Event_15rnn61" />
    <sequenceFlow id="Flow_03js57d" sourceRef="Gateway_1nm0nug" targetRef="Event_1yw13up" />
    <endEvent id="Event_0fk5zj7" name="Finish Flow">
      <incoming>Flow_01nosus</incoming>
      <incoming>Flow_1b23zab</incoming>
    </endEvent>
    <sequenceFlow id="Flow_01nosus" sourceRef="Event_15rnn61" targetRef="Event_0fk5zj7" />
    <sequenceFlow id="Flow_1b23zab" sourceRef="Event_1yw13up" targetRef="Event_0fk5zj7" />
  </process>
  <bpmndi:BPMNDiagram id="sid-74620812-92c4-44e5-949c-aa47393d3830">
    <bpmndi:BPMNPlane id="sid-cdcae759-2af7-4a6d-bd02-53f3352a731d" bpmnElement="sid-c0e745ff-361e-4afb-8c8d-2a1fc32b1424">
      <bpmndi:BPMNShape id="sid-87F4C1D6-25E1-4A45-9DA7-AD945993D06F_gui" bpmnElement="sid-87F4C1D6-25E1-4A45-9DA7-AD945993D06F" isHorizontal="true">
        <omgdc:Bounds x="83" y="105" width="737" height="315" />
        <bpmndi:BPMNLabel labelStyle="sid-84cb49fd-2f7c-44fb-8950-83c3fa153d3b" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="sid-57E4FE0D-18E4-478D-BC5D-B15164E93254_gui" bpmnElement="sid-57E4FE0D-18E4-478D-BC5D-B15164E93254" isHorizontal="true">
        <omgdc:Bounds x="113" y="105" width="707" height="315" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_02ttpvf_di" bpmnElement="Event_02ttpvf">
        <omgdc:Bounds x="152" y="232" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="140" y="275" width="60" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_1nm0nug_di" bpmnElement="Gateway_1nm0nug" isMarkerVisible="true">
        <omgdc:Bounds x="265" y="225" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="324.5" y="243" width="43" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_15rnn61_di" bpmnElement="Event_15rnn61">
        <omgdc:Bounds x="272" y="152" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="281" y="122" width="18" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1yw13up_di" bpmnElement="Event_1yw13up">
        <omgdc:Bounds x="272" y="332" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="283" y="375" width="15" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0fk5zj7_di" bpmnElement="Event_0fk5zj7">
        <omgdc:Bounds x="492" y="232" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <omgdc:Bounds x="482" y="275" width="57" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1vvkcwz_di" bpmnElement="Flow_1vvkcwz">
        <omgdi:waypoint x="188" y="250" />
        <omgdi:waypoint x="265" y="250" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_00rdo5n_di" bpmnElement="Flow_00rdo5n">
        <omgdi:waypoint x="290" y="225" />
        <omgdi:waypoint x="290" y="188" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_03js57d_di" bpmnElement="Flow_03js57d">
        <omgdi:waypoint x="290" y="275" />
        <omgdi:waypoint x="290" y="332" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_01nosus_di" bpmnElement="Flow_01nosus">
        <omgdi:waypoint x="308" y="170" />
        <omgdi:waypoint x="400" y="170" />
        <omgdi:waypoint x="400" y="250" />
        <omgdi:waypoint x="492" y="250" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1b23zab_di" bpmnElement="Flow_1b23zab">
        <omgdi:waypoint x="308" y="350" />
        <omgdi:waypoint x="400" y="350" />
        <omgdi:waypoint x="400" y="250" />
        <omgdi:waypoint x="492" y="250" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
    <bpmndi:BPMNLabelStyle id="sid-e0502d32-f8d1-41cf-9c4a-cbb49fecf581">
      <omgdc:Font name="Arial" size="11" isBold="false" isItalic="false" isUnderline="false" isStrikeThrough="false" />
    </bpmndi:BPMNLabelStyle>
    <bpmndi:BPMNLabelStyle id="sid-84cb49fd-2f7c-44fb-8950-83c3fa153d3b">
      <omgdc:Font name="Arial" size="12" isBold="false" isItalic="false" isUnderline="false" isStrikeThrough="false" />
    </bpmndi:BPMNLabelStyle>
  </bpmndi:BPMNDiagram>
</definitions>
`;

  constructor() {
    this.bpmnJS = new Modeler({
      container: this.diagramRef?.nativeElement,
      propertiesPanel: {
        parent: this.propertiesRef
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        customPropertiesProvider
      ],
      moddleExtensions: {
        custom: custom
      }
    })
  }

  ngAfterContentInit(): void {
    // attach BpmnJS instance to DOM element
    this.bpmnJS.attachTo(this.diagramRef!.nativeElement);

    const propertiesPanel =this.bpmnJS.get('propertiesPanel');

    // @ts-ignore
    propertiesPanel.attachTo(this.propertiesRef!.nativeElement);
    this.importDiagram(this.xml);
  }


  ngOnDestroy(): void {
    // destroy BpmnJS instance
    this.bpmnJS.destroy();
  }

  /**
   * Creates a Promise to import the given XML into the current
   * BpmnJS instance, then returns it as an Observable.
   */
  private importDiagram(xml: string): Observable<{warnings: Array<any>}> {
    return from(this.bpmnJS.importXML(xml) as Promise<{warnings: Array<any>}>);
  }
}
