import React, { useEffect, useRef } from "react";

const CanvasChan = props => {
  const canvasRef = useRef(null);

  const drawCoordinates = (x, y, color) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = color;

    context.beginPath();
    context.arc(x, y, 5, 0, Math.PI * 2, true);
    context.fill();
  };

  const drawLine = (point1, point2, color) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.strokeStyle = color;
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(point1[0], point1[1]);
    context.lineTo(point2[0], point2[1]);
    context.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    clearCanvas();
    if (
      props.toDraw.phase === "Phase 0: Initial Points" ||
      props.toDraw.phase === "Phase 4: Restart"
    ) {
      for (let i = 0; i < props.points.length; i++)
        drawCoordinates(props.points[i][0], props.points[i][1], "#000000");
    }

    if (props.toDraw.phase === "Phase 2: Graham Scan on each partition") {
      for (let i = 0; i < props.toDraw.prevLines.length; i++) {
        for (let j = 0; j < props.toDraw.prevLines[i].length - 1; j++) {
          drawLine(
            props.toDraw.prevLines[i][j],
            props.toDraw.prevLines[i][j + 1],
            props.toDraw.color[i]
          );
        }
      }
    }
    if (props.toDraw.phase === "Phase 3: Jarvis March") {
      for (let i = 0; i < props.toDraw.prevLines.length; i++) {
        let tempColor = "#9ca3af";
        if ("selectedPrevHull" in props.toDraw) {
          if (i === props.toDraw.selectedPrevHull) tempColor = "#000000";
        }
        for (let j = 0; j < props.toDraw.prevLines[i].length - 1; j++) {
          drawLine(
            props.toDraw.prevLines[i][j],
            props.toDraw.prevLines[i][j + 1],
            tempColor
          );
        }
      }
    }
    if (
      props.toDraw.phase === "Phase 2: Graham Scan on each partition" ||
      props.toDraw.phase === "Phase 3: Jarvis March"
    ) {
      if ("lines" in props.toDraw) {
        for (let i = 0; i < props.toDraw.lines.length - 1; i++) {
          drawLine(
            props.toDraw.lines[i],
            props.toDraw.lines[i + 1],
            i >= props.toDraw.lines.length - 3
              ? props.toDraw.lineColors[0]
              : props.toDraw.lineColors[1]
          );
        }
      }
    }
    if (
      props.toDraw.phase === "Phase 1: Partition" ||
      props.toDraw.phase === "Phase 2: Graham Scan on each partition" ||
      props.toDraw.phase === "Phase 3: Jarvis March"
    ) {
      for (let i = 0; i < props.toDraw.partitions.length; i++) {
        let tempColor = "#9ca3af";
        if ("selectedPrevHull" in props.toDraw) {
          if (i === props.toDraw.selectedPrevHull) tempColor = "#000000";
        }
        for (let j = 0; j < props.toDraw.partitions[i].length; j++) {
          drawCoordinates(
            props.toDraw.partitions[i][j][0],
            props.toDraw.partitions[i][j][1],
            props.toDraw.phase === "Phase 3: Jarvis March"
              ? tempColor
              : props.toDraw.color[i]
          );
        }
      }
    }
    if (
      props.toDraw.message ===
      "Locate the lowest point and add it to the partial hull."
    ) {
      drawCoordinates(
        props.toDraw.pointsToColor[0],
        props.toDraw.pointsToColor[1],
        "#facc15"
      );
    }

    if (
      props.toDraw.message ===
      "Using the right tangent points from each mini-hull with respect to the current partial hull (highlighted in yellow), add the best point to the hull (highlighted in green)."
    ) {
      for (let i = 0; i < props.toDraw.bestPoints.length; i++)
        drawCoordinates(
          props.toDraw.bestPoints[i][0],
          props.toDraw.bestPoints[i][1],
          "#facc15"
        );
      drawCoordinates(
        props.toDraw.bestPointToColor[0],
        props.toDraw.bestPointToColor[1],
        "#16a34a"
      );
    }
    if (
      props.toDraw.message ===
      "Find the tangent point of each hull which creates the minimum turning angle with the last segment in the partial hull. Green highlighted point is the current best point."
    ) {
      drawCoordinates(
        props.toDraw.bestPointToColor[0],
        props.toDraw.bestPointToColor[1],
        "#16a34a"
      );
      drawCoordinates(
        props.toDraw.pointsToColor[0],
        props.toDraw.pointsToColor[1],
        "#facc15"
      );
    }
  }, [props]);

  return (
    <div>
      <div className="">
        <canvas
          ref={canvasRef}
          width="1300px"
          height="700px"
          style={{ border: "solid 2px #000000" }}
          className="mx-auto rounded mt-2"
        ></canvas>
      </div>
      <div className="mt-1">
        <h1 class="font-extrabold">{props.toDraw.phase}</h1>
        <p>{props.toDraw.message}</p>
      </div>
    </div>
  );
};

export default CanvasChan;
