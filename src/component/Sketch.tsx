import { useCanvas } from "./hooks/useCanvas";
import { Options } from "./types";

interface PropsType {
  width: number;
  height: number;
  options: Options;
}

const Sketch = ({ width, height, options }: PropsType) => {
  const [canvasRef] = useCanvas(options);

  return (
    <canvas ref={canvasRef} width={width} height={height}></canvas>
  );
}

export default Sketch;