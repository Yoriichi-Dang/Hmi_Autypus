import { AngleArc, Value } from "../components/soc-component";
export function degreeToRadian(degrees: number): number {
  return degrees * (Math.PI / 180);
}
export function calculateArc(
  value: Value,
  angleArc: AngleArc,
  numberPart: number,
  numberSubPart: number
) {
  const distanceAngle = angleArc.end - angleArc.start;
  const partAngle = distanceAngle / (numberPart - 1);
  const partValue = (value.max - value.min) / (numberPart - 1);
  const subPartAngle = partAngle / (numberSubPart + 1);
  const subPartValue = partValue / (numberSubPart + 1);
  return { distanceAngle, partAngle, partValue, subPartAngle, subPartValue };
}
