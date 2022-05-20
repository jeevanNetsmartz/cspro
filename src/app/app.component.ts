import { Component, HostListener, ViewChild } from '@angular/core';
import cytoscape, { EdgeDefinition, LayoutOptions, NodeDefinition, Stylesheet } from 'cytoscape';
import { CoseLayoutOptionsImpl, CytoscapeGraphComponent } from 'cytoscape-angular';
import { MenuItem } from 'primeng/api';
import edgehandles from 'cytoscape-edgehandles';

cytoscape.use(edgehandles);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  bigGraphNodes: NodeDefinition[] = []
  bigGraphEdges: EdgeDefinition[] = []
  bigGraphStylesheet: Stylesheet[] = []
  bigGraphLayoutOptions: LayoutOptions = new CoseLayoutOptionsImpl()

  @ViewChild('biggraph')
  bigGraph: CytoscapeGraphComponent | null = null

  cy = cytoscape();
  constructor() { }
  public eh: any;

  items: MenuItem[] = [];
  rightClickX = 0;
  rightClickY = 0;
  nodeName: string = '';
  selectedNode: string = '';
  nodeAction: string = '';

  edgeName: string = '';
  selectedEdge: string = '';
  edgeAction: string = '';

  selectedDeleteElement: string = '';
  drawMode: string = '';
  
  nodeElements = [
    { data: { id: 'a', label: 'a', name: 'a', action: '' } },
    { data: { id: 'b', label: 'b', name: 'b', action: '' } },
    { data: { id: 'ab', source: 'a', target: 'b', action: '' } }
  ]

  ngOnInit(): void {

    // const N = 300;
    // const gData = {
    //   nodes: [...Array(N).keys()].map(i => ({ id: i })),
    //   links: [...Array(N).keys()]
    //     .filter(id => id)
    //     .map(id => ({
    //       source: id,
    //       target: Math.round(Math.random() * (id-1))
    //     }))
    // };

    // if(document.getElementById('cy') !== null){
    //   const myGraph = ForceGraph();
    //   myGraph(document.getElementById('cy') as HTMLElement)
    //   .graphData(gData);  
    // }


    this.cy = cytoscape({
      container: document.getElementById('cy'),
      elements: this.nodeElements,
      layout: {
        name: 'grid'
      },
      style: [
        {
          "selector": "core",
          "css": {
            "background-color": "rgb(7,9,10)"
          }
        },
        {
          "selector": "node",
          "css": {
            "background-color": "rgb(255,255,255)",
            "text-valign": "center",
            "text-halign": "center",
            "text-wrap": "wrap",
            "border-color": "rgb(87,204,153)",
            "border-width": 1.0,
            "font-family": "Sans-Serif",
            "width": 'label',
            "height": 'label',
            "font-weight": "normal",
            "font-size": 12,
            "background-opacity": 1.0,
            "shape": "rectangle",
            "color": "rgb(0,0,0)",
            "text-opacity": 1.0,
            "border-opacity": 1.0,
            "content": "data(name)",
            'padding-left': '20',
            'padding-right': '20',
            'padding-top': '10',
            'padding-bottom': '10'
          }
        },
        {
          "selector": "node:selected",
          "css": {
            "background-color": "rgb(87,204,153)"
          }
        },
        {
          "selector": "edge",
          "style": {
            'curve-style': 'bezier',
            "content": "Sample",
            'target-arrow-shape': 'triangle'
          }
        },
        {
          selector: '.eh-handle',
          style: {
            'background-color': 'red',
            'width': 12,
            'height': 12,
            'shape': 'ellipse',
            'overlay-opacity': 0,
            'border-width': 12, // makes the handle easier to hit
            'border-opacity': 0
          }
        },

        {
          selector: '.eh-hover',
          style: {
            'background-color': 'red'
          }
        },

        {
          selector: '.eh-source',
          style: {
            'border-width': 2,
            'border-color': 'red'
          }
        },

        {
          selector: '.eh-target',
          style: {
            'border-width': 2,
            'border-color': 'red'
          }
        },

        {
          selector: '.eh-preview, .eh-ghost-edge',
          style: {
            'background-color': 'red',
            'line-color': 'red',
            'target-arrow-color': 'red',
            'source-arrow-color': 'red'
          }
        },

        {
          selector: '.eh-ghost-edge.eh-preview-active',
          style: {
            'opacity': 0
          }
        }
      ]

    });
    this.cy.resize();

    this.cy.on('tapstart', 'node', (event: any) => {
      this.onNodeClicked(event)
    });


    this.cy.on('tapstart', 'edge', (event: any) => {
      this.onEdgeClicked(event)
    });

    this.bigGraphStylesheet = [{
      "selector": "node",
      "css": {
        "background-color": "rgb(255,255,255)",
        "text-valign": "center",
        "text-halign": "center",
        "text-wrap": "wrap",
        "border-color": "rgb(87,204,153)",
        "border-width": 2.0,
        "font-family": "Sans-Serif",
        // "width": 'label',
        // "height": 'label',
        "font-weight": "normal",
        "font-size": 14,
        "background-opacity": 1.0,
        "shape": "roundrectangle",
        "color": "rgb(0,0,0)",
        "text-opacity": 1.0,
        "border-opacity": 1.0,
        "content": "data(name)",
        'padding-left': '20',
        'padding-right': '20',
        'padding-top': '10',
        'padding-bottom': '10'
      }
    },
    {
      "selector": "node:selected",
      "css": {
        "background-color": "rgb(87,204,153)"
      }
    }, {
      "selector": "edge",
      "css": {
        "target-arrow-color": "rgb(0,0,0)",
        "font-family": "Dialog",
        "font-weight": "normal",
        "text-opacity": 1.0,
        "content": "Sample",
        "line-color": "rgb(132,132,132)",
        "line-style": "solid",
        "font-size": 14,
        "source-arrow-shape": "none",
        "source-arrow-color": "rgb(0,0,0)",
        "target-arrow-shape": "triangle",
        "width": 3.0,
        "color": "rgb(0,0,0)",
        "opacity": 1.0
      }
    }, {
      "selector": "edge:selected",
      "css": {
        "line-color": "rgb(255,0,0)"
      }
    }]




    this.items = [
      {
        label: 'New', icon: 'pi pi-fw pi-search', command: (event: any) => {
          const vertexName = this.makeid(20)

          var newNode1 = {
            id: event.originalEvent.clientX,
            label: vertexName,
            name: vertexName,
            action: '',
            color: 'red'
          }
          this.nodeElements.push({ data: newNode1 })

          this.cy.add(
            {
              group: 'nodes',
              data: newNode1,
              renderedPosition: {
                x: event.originalEvent.clientX,
                y: event.originalEvent.clientY
              }
            })

          var newEdge = {
            id: `e-${vertexName}`,
            source: event.originalEvent.clientX,
            name: vertexName,
            target: this.selectedNode || 'a',
            action: ''
          }

          this.cy.add({
            group: 'edges',
            data: newEdge
          })
          // console.log(`app gets big layout toolbar change ${JSON.stringify($event)}`)
          // this.bigGraph?.render()

          //event.item: menuitem metadata
        }
      },
      { label: 'Delete', icon: 'pi pi-fw pi-times' },
      { label: 'Delete Node', icon: 'pi pi-fw pi-times', command: (event?: any) => this.deleteNode() },
      { label: 'Delete Edge', icon: 'pi pi-fw pi-times', command: (event?: any) => this.deleteEdge() }
    ];



    this.eh = this.cy.edgehandles({
      hoverDelay: 150, // time spent hovering over a target node before it is considered selected
      snap: true, // when enabled, the edge can be drawn by just moving close to a target node (can be confusing on compound graphs)
      snapThreshold: 50, // the target node must be less than or equal to this many pixels away from the cursor/finger
      snapFrequency: 15, // the number of times per second (Hz) that snap checks done (lower is less expensive)
      noEdgeEventsInDraw: true, // set events:no to edges during draws, prevents mouseouts on compounds
      disableBrowserGestures: true, // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
      canConnect: function (sourceNode: any, targetNode: any) {
        // whether an edge can be created between source and target
        return sourceNode.same(targetNode) || !sourceNode.same(targetNode);
      }
    });

    this.eh.disableDrawMode();
    this.drawMode = 'Off'

  }

  ngAfterViewInit(): void {
  }

  bigGraphLayoutToolbarChange($event: any): void {
    // console.log(`app gets big layout toolbar change ${JSON.stringify($event)}`)
    this.bigGraph?.render()
  }

  bigGraphLayoutStylesToolbarChange($event: cytoscape.Stylesheet[]): void {
    // console.log(`app gets biggraph style toolbar change ${JSON.stringify($event)}`)
    this.bigGraph?.render()
  }

  bigGraphLayoutStylesSelectorChange(selector: string): void {
    // console.log(`app gets biggraph style selector change: ${JSON.stringify(selector)}`)
    this.bigGraph?.zoomToElement(selector)
  }

  private makeid(length: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }



  private stampNodeAndElementGroupsAndDeleteFields(result: any, edgeFields: string[]): void {
    result.elements.nodes.forEach((node: { [x: string]: string; }) => {
      node['group'] = 'nodes'
    })

    result.elements.edges.forEach((edge: { group: string; style: any; }) => {
      edge.group = 'edges'
      this.deleteFields(edge.style, edgeFields)
    })
  }

  private deleteFields(obj: any, fields: string[]): void {
    fields.forEach(field => delete obj[field])
  }

  onNodeClicked(e: any) {
    var node = e.target;
    var nodeData = node.json();
    this.nodeName = nodeData.data.name
    this.nodeAction = nodeData.data.action
    this.selectedNode = nodeData.data.id
    this.selectedEdge = '';
  }


  onEdgeClicked(e: any) {
    var edge = e.target;
    var edgeData = edge.json();
    let data = this.cy.$('#' + this.selectedEdge).css();
    this.edgeName = data['content'] || ''
    this.edgeAction = edgeData.data.action
    this.selectedEdge = edgeData.data.id
    this.selectedNode = '';
  }

  ontextChange() {
    this.nodeElements.forEach(element => {
      if (element.data.id === this.selectedNode) {
        element.data.name = this.nodeName
      }
    });
    var j = this.cy.$('#' + this.selectedNode);
    j.data('name', this.nodeName);
  }

  ontextChangeEdge() {
    this.cy.$('#' + this.selectedEdge).css({
      content: '' + this.edgeName
    });
  }

  ontextChangeActionNode() {
    var j = this.cy.$('#' + this.selectedNode);
    j.data('action', this.nodeAction);
  }

  ontextChangeActionEdge() {
    var j = this.cy.$('#' + this.selectedEdge);
    j.data('action', this.edgeAction);
  }

  getData() {
    let graphData: any = this.cy.json()
    console.log(graphData['elements'])
  }

  drawModeOn() {
    this.drawMode = 'On'
    this.eh.enableDrawMode();
  }

  drawModeOff() {
    this.drawMode = 'Off'
    this.eh.disableDrawMode();
  }

  deleteEdge() {
    if (this.selectedEdge) {
      this.cy.remove('#' + this.selectedEdge);
    } else {
      alert("Please select a edge")
    }
  }

  deleteNode() {
    if (this.selectedNode) {
      this.cy.remove('edge[source=\'' + this.selectedNode + '\']');
      this.cy.remove('edge[target=\'' + this.selectedNode + '\']');
      this.cy.remove('#' + this.selectedNode);
    } else {
      alert("Please select a node")
    }
  }


  @HostListener('window:keydown.shift', ['$event'])
  onKeyPress($event: KeyboardEvent) {
    this.drawModeOn()
  }
  @HostListener('window:keydown.control', ['$event'])
  onKeyUp($event: KeyboardEvent) {
    this.drawModeOff()
  }
}
