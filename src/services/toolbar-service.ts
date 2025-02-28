import * as joint from '@joint/plus';
import { DirectedGraph } from '@joint/layout-directed-graph';
import { fontsStyleSheet } from '../config/font-style-sheet';

export class ToolbarService {

    toolbar: joint.ui.Toolbar;
    fileTools: { [key: string]: any };
    layoutTools: { [key: string]: any };
    shareTools: { [key: string]: any };

    constructor(private readonly element: HTMLElement) { }

    create(
        commandManager: joint.dia.CommandManager,
        paperScroller: joint.ui.PaperScroller,
        graph: joint.dia.Graph,
        paper: joint.dia.Paper
    ) {
        const { tools, groups } = this.getToolbarConfig();

        this.toolbar = new joint.ui.Toolbar({
            groups,
            tools,
            autoToggle: true,
            references: {
                paperScroller: paperScroller,
                commandManager: commandManager
            },
            el: this.element,
        });

        this.toolbar.render();

        this.fileTools = [
            {
                action: 'new',
                content: 'New file'
            },
            {
                action: 'load',
                content: 'Load file'
            },
            {
                action: 'save',
                content: 'Save file'
            }
        ];

        this.shareTools = [
            {
                action: 'exportPNG',
                content: 'Export as PNG'
            },
            {
                action: 'exportSVG',
                content: 'Export as SVG'
            },
            {
                action: 'print',
                content: 'Print'
            }
        ];

        this.layoutTools = [
            {
                action: 'layout-tb',
                content: 'Top to bottom'
            },
            {
                action: 'layout-bt',
                content: 'Bottom to top'
            },
            {
                action: 'layout-lr',
                content: 'Left to right'
            },
            {
                action: 'layout-rl',
                content: 'Right to left'
            }
        ];

        this.toolbar.on({
            'select-file:pointerclick': () => this.openFileSelect(commandManager, graph),
            'select-share:pointerclick': () => this.openShareSelect(paper),
            'select-layout:pointerclick': () => this.openLayoutSelect(graph, paperScroller),
            'select-canvas-settings:pointerclick': () => this.openSettingsPopup(graph)
        });
    }

    getToolbarConfig() {

        return {

            groups: {
                left: {
                    index: 1,
                    align: joint.ui.Toolbar.Align.Left
                },
                right: {
                    index: 2,
                    align: joint.ui.Toolbar.Align.Right
                },
            },

            tools: [
                {
                    type: 'button',
                    name: 'select-file',
                    group: 'left',
                    attrs: {
                        button: {
                            'data-tooltip': 'File',
                            'data-tooltip-position': 'top',
                            'data-tooltip-position-selector': '.toolbar-container'
                        }
                    }
                },
                {
                    type: 'separator',
                    group: 'left',
                },
                {
                    type: 'undo',
                    name: 'undo',
                    group: 'left',
                    attrs: {
                        button: {
                            'data-tooltip': 'Undo',
                            'data-tooltip-position': 'top',
                            'data-tooltip-position-selector': '.toolbar-container'
                        }
                    }
                },
                {
                    type: 'redo',
                    name: 'redo',
                    group: 'left',
                    attrs: {
                        button: {
                            'data-tooltip': 'Redo',
                            'data-tooltip-position': 'top',
                            'data-tooltip-position-selector': '.toolbar-container'
                        }
                    }
                },
                {
                    type: 'separator',
                    group: 'left',
                },
                {
                    type: 'button',
                    name: 'select-layout',
                    group: 'left',
                    text: 'Layout'
                },
                {
                    type: 'button',
                    text: 'Canvas settings',
                    name: 'select-canvas-settings',
                    group: 'right'
                },
                {
                    type: 'separator',
                    group: 'right',
                },
                {
                    type: 'button',
                    name: 'select-share',
                    group: 'right',
                    attrs: {
                        button: {
                            'data-tooltip': 'Share',
                            'data-tooltip-position': 'top',
                            'data-tooltip-position-selector': '.toolbar-container'
                        }
                    }
                }
            ],
        };
    }

    getSettingsInspectorConfig() {
        return {
            inputs: {
                paperColor: {
                    type: 'color',
                    label: 'Paper color'
                },
                snaplines: {
                    type: 'toggle',
                    label: 'Snaplines'
                },
                infinitePaper: {
                    type: 'toggle',
                    label: 'Infinite paper',
                },
                dotGrid: {
                    type: 'toggle',
                    label: 'Dot grid',
                },
                gridSize: {
                    type: 'range',
                    label: 'Grid size',
                    min: 1,
                    max: 50,
                    step: 1
                }
            }
        }
    }

    layoutDirectedGraph(rankDir: 'TB' | 'BT' | 'LR' | 'RL', graph: joint.dia.Graph, paperScroller: joint.ui.PaperScroller) {

        DirectedGraph.layout(graph, {
            setVertices: true,
            rankDir,
            marginX: 100,
            marginY: 100
        });

        paperScroller.centerContent({ useModelGeometry: true });
    }

    async exportPNG(paper: joint.dia.Paper) {
        paper.hideTools();
        joint.format.toPNG(paper, (dataURL: string) => {
            new joint.ui.Lightbox({
                image: dataURL,
                downloadable: true,
                fileName: 'joint-plus',
            }).open();
            paper.showTools();
        }, {
            padding: 10,
            useComputedStyles: false,
            grid: true,
            stylesheet: await fontsStyleSheet()
        });
    }

    async exportSVG(paper: joint.dia.Paper) {
        paper.hideTools();
        joint.format.toSVG(paper, (svg: string) => {
            new joint.ui.Lightbox({
                image: 'data:image/svg+xml,' + encodeURIComponent(svg),
                downloadable: true,
                fileName: 'joint-plus'
            }).open();
            paper.showTools();
        }, {
            preserveDimensions: true,
            convertImagesToDataUris: true,
            useComputedStyles: false,
            grid: true,
            stylesheet: await fontsStyleSheet()
        });
    }

    openFileSelect(commandManager: joint.dia.CommandManager, graph: joint.dia.Graph) {
        const target = this.toolbar.getWidgetByName('select-file').el;

        if (joint.ui.ContextToolbar.opened?.options.target === target) {
            joint.ui.ContextToolbar.opened.remove();
            return;
        }

        const contextToolbar = new joint.ui.ContextToolbar({
            target,
            root: this.toolbar.el,
            padding: 0,
            vertical: true,
            position: 'bottom-left',
            anchor: 'top-left',
            tools: this.fileTools
        });

        contextToolbar.on('action:load', () => {
            contextToolbar.remove();

            const fileInput = document.createElement('input');
            fileInput.setAttribute('type', 'file');
            fileInput.setAttribute('accept', '.json');

            fileInput.click();

            fileInput.onchange = () => {
                const file = fileInput.files[0];
                const reader = new FileReader();

                reader.onload = (evt) => {
                    let str = evt.target.result as string;
                    graph.fromJSON(JSON.parse(str));
                    commandManager.reset();
                }

                reader.readAsText(file);
            };
        });

        contextToolbar.on('action:save', () => {
            contextToolbar.remove();
            const str = JSON.stringify(graph.toJSON());
            const bytes = new TextEncoder().encode(str);
            const blob = new Blob([bytes], { type: 'application/json' });
            const el = window.document.createElement('a');
            el.href = window.URL.createObjectURL(blob);
            el.download = 'kitchensink.json';
            document.body.appendChild(el);
            el.click();
            document.body.removeChild(el);
        });

        contextToolbar.on('action:new', () => {
            contextToolbar.remove();
            graph.resetCells([]);
            commandManager.reset();
        });

        contextToolbar.render();
    }

    openLayoutSelect(graph: joint.dia.Graph, paperScroller: joint.ui.PaperScroller) {
        const target = this.toolbar.getWidgetByName('select-layout').el;

        if (joint.ui.ContextToolbar.opened?.options.target === target) {
            joint.ui.ContextToolbar.opened.remove();
            return;
        }

        const contextToolbar = new joint.ui.ContextToolbar({
            target,
            root: this.toolbar.el,
            padding: 0,
            vertical: true,
            position: 'bottom-left',
            anchor: 'top-left',
            tools: this.layoutTools
        });

        contextToolbar.on({
            'action:layout-tb': () => {
                this.layoutDirectedGraph('TB', graph, paperScroller);
                contextToolbar.remove();
            },
            'action:layout-bt': () => {
                this.layoutDirectedGraph('BT', graph, paperScroller);
                contextToolbar.remove();
            },
            'action:layout-lr': () => {
                this.layoutDirectedGraph('LR', graph, paperScroller);
                contextToolbar.remove();
            },
            'action:layout-rl': () => {
                this.layoutDirectedGraph('RL', graph, paperScroller);
                contextToolbar.remove();
            }
        })

        contextToolbar.render();
    }

    openSettingsPopup(graph: joint.dia.Graph) {
        const { inputs } = this.getSettingsInspectorConfig();

        if (joint.ui.Popup.opened) {
            joint.ui.Popup.opened.remove();
            return;
        }

        const settingsInspector = new joint.ui.Inspector({
            cell: graph,
            className: 'settings-inspector',
            inputs
        }).render();

        const settingsPopup = new joint.ui.Popup({
            content: settingsInspector.el,
            target: this.toolbar.getWidgetByName('select-canvas-settings').el,
            root: this.toolbar.el,
            padding: 0,
            position: 'bottom-right',
            anchor: 'top-right',
            autoResize: true,
            arrowPosition: 'none'
        }).render();

        settingsPopup.once('close', () => settingsInspector.updateCell());
    }

    openShareSelect(paper: joint.dia.Paper) {
        const target = this.toolbar.getWidgetByName('select-share').el;

        if (joint.ui.ContextToolbar.opened?.options.target === target) {
            joint.ui.ContextToolbar.opened.remove();
            return;
        }

        const contextToolbar = new joint.ui.ContextToolbar({
            target,
            root: this.toolbar.el,
            padding: 0,
            vertical: true,
            position: 'bottom-right',
            anchor: 'top-right',
            tools: this.shareTools
        });

        contextToolbar.on({
            'action:exportPNG': () => {
                this.exportPNG(paper);
                contextToolbar.remove();
            },
            'action:exportSVG': () => {
                this.exportSVG(paper);
                contextToolbar.remove();
            },
            'action:print': () => {
                joint.format.print(paper, { grid: true })
                contextToolbar.remove();
            }
        })

        contextToolbar.render();
    }
}
