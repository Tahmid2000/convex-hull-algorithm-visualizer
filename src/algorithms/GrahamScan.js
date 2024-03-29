const sortAscendingPoints = (a, b) => {
  if (a[0] === b[0]) return 0;
  else return a[0] < b[0] ? -1 : 1;
};

const determinant = m =>
  m.length === 1
    ? m[0][0]
    : m.length === 2
    ? m[0][0] * m[1][1] - m[0][1] * m[1][0]
    : m[0].reduce(
        (r, e, i) =>
          r +
          (-1) ** (i + 2) *
            e *
            determinant(m.slice(1).map(c => c.filter((_, j) => i !== j))),
        0
      );

const orientation = (p, topOfStack, secondOfStack) => {
  var matrix = [
    [1, p[0], p[1]],
    [1, topOfStack[0], topOfStack[1]],
    [1, secondOfStack[0], secondOfStack[1]]
  ];
  return determinant(matrix);
};

const lowerHull = (points, visualize) => {
  points.sort(sortAscendingPoints);
  var visuliazation = [];
  var stack = [];
  if (visualize)
    visuliazation.push({
      lines: [],
      lineColors: [],
      phase: "Phase 0: Initial",
      message: "Initial Points",
      stack: [...stack]
    });
  stack.push(points[0]);
  stack.push(points[1]);
  if (visualize) {
    visuliazation.push({
      lines: [stack[stack.length - 2], stack[stack.length - 1]],
      lineColors: ["#b91c1c"],
      phase: "Phase 1: Lower Convex Hull",
      message:
        "Sort points by x-coordinate and add the leftmost points to the stack.",
      stack: [...stack]
    });
  }
  for (let i = 2; i < points.length; i++) {
    while (stack.length >= 2) {
      if (visualize) {
        visuliazation.push({
          lines: [...stack, points[i]],
          lineColors: ["#b91c1c", "#16a34a"],
          pointsToColor: points[i],
          phase: "Phase 1: Lower Convex Hull",
          message: `${
            orientation(
              points[i],
              stack[stack.length - 1],
              stack[stack.length - 2]
            ) <= 0
              ? "The 2 rightmost points on the current lower convex hull and the next point on the canvas make a right-hand turn so we remove the rightmost point of the lower convex hull."
              : "The 2 rightmost points on the current lower convex hull and the next point on the canvas make a left-hand turn so we add the new point to the lower convex hull."
          }`,
          stack: [...stack]
        });
      }
      if (
        orientation(
          points[i],
          stack[stack.length - 1],
          stack[stack.length - 2]
        ) <= 0
      ) {
        stack.pop();
      } else break;
    }
    stack.push(points[i]);
  }
  if (visualize) {
    visuliazation.push({
      lines: [...stack],
      lineColors: ["#16a34a", "#16a34a"],
      phase: "Phase 1: Lower Convex Hull",
      message: "Lower Convex Hull complete!",
      stack: [...stack]
    });
  }
  return [stack, visuliazation];
};

const sortDescendingPoints = (a, b) => {
  if (a[0] === b[0]) return 0;
  else return a[0] > b[0] ? -1 : 1;
};

const upperHull = (points, visualize, finalLower) => {
  points.sort(sortDescendingPoints);
  var visuliazation = [];
  var stack = [];
  stack.push(points[0]);
  stack.push(points[1]);
  if (visualize) {
    visuliazation.push({
      lines: [...finalLower, stack[stack.length - 2], stack[stack.length - 1]],
      lineColors: ["#b91c1c", "#16a34a"],
      phase: "Phase 2: Upper Convex Hull",
      message:
        "Sort points by x-coordinate and add the rightmost points to the stack.",
      stack: [...stack]
    });
  }
  for (let i = 2; i < points.length; i++) {
    while (stack.length >= 2) {
      if (visualize) {
        visuliazation.push({
          lines: [...finalLower, ...stack, points[i]],
          lineColors: ["#b91c1c", "#16a34a"],
          pointsToColor: points[i],
          phase: "Phase 2: Upper Convex Hull",
          message: `${
            orientation(
              points[i],
              stack[stack.length - 1],
              stack[stack.length - 2]
            ) <= 0
              ? "The 2 leftmost points on the current upper convex hull and the next point on the canvas three points make a right-hand turn so we remove the leftmost point of the upper convex hull."
              : "The 2 leftmost points on the current upper convex hull and the next point on the canvas three points make a left-hand turn so we add the new point to the lower convex hull."
          }`,
          stack: [...stack]
        });
      }
      if (
        orientation(
          points[i],
          stack[stack.length - 1],
          stack[stack.length - 2]
        ) <= 0
      ) {
        stack.pop();
      } else break;
    }
    stack.push(points[i]);
  }
  if (visualize) {
    visuliazation.push({
      lines: [...finalLower, ...stack],
      lineColors: ["#16a34a", "#16a34a"],
      phase: "Phase 2: Upper Convex Hull",
      message: "Convex Hull complete!",
      stack: [...stack]
    });
  }
  return [stack, visuliazation];
};

const grahamScan = points => {
  var lower = lowerHull(points, false)[0];
  var upper = upperHull(points, false, false)[0];
  for (let i = 0; i < upper.length; i++) lower.push(upper[i]);
  return lower;
};

const grahamScanVisualization = points => {
  var lower = lowerHull(points, true)[1];
  var upper = upperHull(points, true, lower[lower.length - 1]["lines"])[1];
  for (let i = 0; i < upper.length; i++) lower.push(upper[i]);
  return lower;
};

export { grahamScan, grahamScanVisualization };
