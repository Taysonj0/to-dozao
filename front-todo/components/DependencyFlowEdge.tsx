"use client";

import { BaseEdge, type Edge, type EdgeProps } from "@xyflow/react";

export type DependencyEdgeData = {
  sourceOffsetY: number;
  targetOffsetY: number;
  laneOffsetX: number;
};

export type DependencyFlowEdgeType = Edge<
  DependencyEdgeData,
  "dependencyEdge"
>;

function getSign(value: number): number {
  if (value === 0) return 0;
  return value > 0 ? 1 : -1;
}

function buildOrthogonalPath(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  laneOffsetX: number,
) {
  const gapFromSource = 26;
  const gapToTarget = 26;

  const startX = sourceX;
  const startY = sourceY;
  const endX = targetX;
  const endY = targetY;

  const firstX = startX + gapFromSource;
  const lastX = endX - gapToTarget;

  const midBaseX = firstX + (lastX - firstX) / 2;
  const laneX = midBaseX + laneOffsetX;

  const verticalDistance = Math.abs(endY - startY);
  const radius = Math.min(14, verticalDistance / 2, Math.abs(laneX - firstX));
  const secondRadius = Math.min(
    14,
    verticalDistance / 2,
    Math.abs(lastX - laneX),
  );

  const turnDirectionY = getSign(endY - startY);

  if (turnDirectionY === 0) {
    return `M ${startX},${startY} L ${endX},${endY}`;
  }

  const firstCornerStartY = startY;
  const firstCornerEndY = startY + turnDirectionY * radius;

  const secondCornerStartY = endY - turnDirectionY * secondRadius;
  const secondCornerEndY = endY;

  return [
    `M ${startX},${startY}`,
    `L ${firstX},${startY}`,
    `L ${laneX - radius},${firstCornerStartY}`,
    `Q ${laneX},${firstCornerStartY} ${laneX},${firstCornerEndY}`,
    `L ${laneX},${secondCornerStartY}`,
    `Q ${laneX},${secondCornerEndY} ${laneX + secondRadius},${secondCornerEndY}`,
    `L ${lastX},${endY}`,
    `L ${endX},${endY}`,
  ].join(" ");
}

export default function DependencyFlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  style,
  data,
}: EdgeProps<DependencyFlowEdgeType>) {
  const sourceOffsetY = data?.sourceOffsetY ?? 0;
  const targetOffsetY = data?.targetOffsetY ?? 0;
  const laneOffsetX = data?.laneOffsetX ?? 0;

  const path = buildOrthogonalPath(
    sourceX,
    sourceY + sourceOffsetY,
    targetX,
    targetY + targetOffsetY,
    laneOffsetX,
  );

  return (
    <BaseEdge
      id={id}
      path={path}
      markerEnd={markerEnd}
      style={style}
      interactionWidth={28}
    />
  );
}