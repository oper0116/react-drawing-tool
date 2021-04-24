import { useCallback, useState } from "react";
import { useCanvas } from "./hooks";
import { Options, PEN_TYPE } from "./types";

const colors = [
  '#000',
  '#f00',
  '#0f0',
  '#00f'
]

const DrawingTool = () => {

  const [option, setOption] = useState<Options>({ color: colors[0], pen: PEN_TYPE.BASIC });

  const [canvasRef] = useCanvas(option);

  const setColor = useCallback((color) => {
    setOption(item => {
      return ({ ...item, color })
    });
  }, []);

  const setPen = useCallback((pen) => {
    setOption(item => {
      return ({ ...item, pen })
    });
  }, []);

  const onClear = () => {
    const context = canvasRef.current!.getContext('2d');
    context?.clearRect(0, 0, 600, 400);
  }

  return (
    <>
      <canvas ref={canvasRef} width={600} height={400}></canvas >
      <div className="react-drawing-tool">
        <ul className="react-drawing-tool-pens">
          <li onClick={() => setPen(PEN_TYPE.BASIC)}>BASIC</li>
          <li onClick={() => setPen(PEN_TYPE.HIGHLIGHTER)}>HIGHLIGHTER</li>
          <li onClick={() => setPen(PEN_TYPE.ERASER)}>ERASER</li>
        </ul>
        <ul className="react-drawing-tool-colors">
          {
            colors.map(color => {
              return (
                <li
                  style={{ backgroundColor: `${color}` }}
                  className="item"
                  onClick={() => setColor(color)}
                >{color}
                </li>
              )
            })
          }
        </ul>
        <ul>
          <li>
            <button onClick={onClear}>Clear</button>
          </li>
        </ul>
      </div>
    </>
  );
}

export default DrawingTool;