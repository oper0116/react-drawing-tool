import { useCanvas } from "./hooks";

const DrawingTool = () => {

  const [canvasRef] = useCanvas();

  return (
    <canvas ref={canvasRef} width={600} height={400} style={{ backgroundColor: '#f00' }}></canvas >
  );
}

export default DrawingTool;