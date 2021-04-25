import { memo, useCallback, useState } from "react";
import { useCanvas } from "./hooks/useCanvas";
import { MODE, Options, PEN_TYPE } from "./types";

interface PropsType {
  options: Options;
}

const Sketch = ({ options }: PropsType) => {
  const [canvasRef] = useCanvas(options);


  return (
    <canvas ref={canvasRef} width={600} height={400}></canvas>
  );
}

export default Sketch;