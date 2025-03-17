import * as joint from "@joint/plus/joint-plus";
import { Point } from "../services/kitchensink-service";
export function degreeToRadian(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function drawArc(
  graph: joint.dia.Graph,
  startAngle: number,
  endAngle: number,
  position: Point,
  radius: number
) {
  const w = radius * 2; // Chiều rộng
  const h = radius * 2; // Chiều cao

  // Đảm bảo góc 0 nằm ở bên phải
  startAngle = startAngle - 90; // Điều chỉnh góc bắt đầu
  endAngle = endAngle - 90; // Điều chỉnh góc kết thúc

  const startX = w / 2 + Math.cos(degreeToRadian(startAngle)) * (w / 2);
  const startY = h / 2 + Math.sin(degreeToRadian(startAngle)) * (h / 2);
  const endX = w / 2 + Math.cos(degreeToRadian(endAngle)) * (w / 2);
  const endY = h / 2 + Math.sin(degreeToRadian(endAngle)) * (h / 2);

  const pathData = `
  M ${startX} ${startY}  // Di chuyển đến điểm bắt đầu
  A ${w / 2} ${h / 2} 0 1 0 ${endX} ${endY}  // Vẽ cung tròn
`;

  const path = new joint.shapes.standard.Path();
  path.resize(w, h);
  path.position(position.x - w / 2, position.y - h / 2);
  path.attr("root/title", "shapes.standard.Path");
  path.attr("body/refD", pathData);
  graph.addCell(path);
}

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
