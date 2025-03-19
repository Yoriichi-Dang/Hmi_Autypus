import * as joint from "@joint/plus";
const groupTemplate = new joint.shapes.standard.Rectangle({
  attrs: {
    root: {
      pointerEvents: "none",
    },
    body: {
      // For the purpose of the demo it has a color (it should be `none` in fact)
      stroke: "#FF4468",
      strokeDasharray: "5,5",
      strokeWidth: 2,
      fill: "#FF4468",
      fillOpacity: 0.2,
    },
  },
});
function groupElements(
  elements: joint.dia.Element[],
  graph: joint.dia.Graph,
  selection: joint.ui.Selection
) {
  const minZ = elements.reduce(
    (z, el) => Math.min(el.get("z") || 0, z),
    -Infinity
  );
  const group = groupTemplate.clone();
  group.set("z", minZ - 1);
  group.addTo(graph);
  group.embed(elements);
  group.fitEmbeds();
  selection.collection.reset([group]);
}

function ungroupElement(
  element: joint.dia.Element,
  selection: joint.ui.Selection
) {
  const embeds = element.getEmbeddedCells();
  if (embeds.length === 0) return;
  element.unembed(embeds);
  element.remove();
  selection.collection.reset(embeds);
}
function toggleSelection(
  selection: joint.ui.Selection,
  graph: joint.dia.Graph
) {
  const elements = selection.collection.toArray();
  if (elements.length === 0) return;
  if (elements.length === 1) {
    ungroupElement(elements[0], selection);
  } else {
    groupElements(elements, graph, selection);
  }
}
export { toggleSelection };
