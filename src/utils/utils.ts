import * as joint from "@joint/plus/joint-plus";
import { Point } from "../services/kitchensink-service";

export function drawLine(
  graph: joint.dia.Graph,
  startPoint: Point,
  endPoint: Point
) {
  const path = new joint.shapes.standard.Path();
  let tempPoint: Point = null;
  if (startPoint.x > endPoint.x) {
    tempPoint = startPoint;
    startPoint = endPoint;
    endPoint = tempPoint;
  }
  const width = Math.abs(startPoint.x - endPoint.x);
  const height = Math.abs(startPoint.y - endPoint.y);
  path.resize(width, height);
  path.position(
    Math.min(startPoint.x, endPoint.x),
    Math.min(startPoint.y, endPoint.y)
  );
  path.attr("root/title", "shapes.standard.Path");
  if (startPoint.y > endPoint.y) {
    path.attr("body/refD", `M 0 ${height} L ${width} 0`);
  } else {
    path.attr("body/refD", `M 0 0 L ${width} ${height}`);
  }
  graph.addCell(path);
}
