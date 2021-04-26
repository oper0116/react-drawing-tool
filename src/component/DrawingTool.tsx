import { useCallback, useState } from "react";
import Sketch from "./Sketch";
import { MODE, Options, PEN_TYPE } from "./types";

const colors = [
  '#000',
  '#f00',
  '#0f0',
  '#00f'
]

const DrawingTool = () => {
  const [options, setOption] = useState<Options>({
    mode: MODE.DRAWING,
    color: colors[0],
    pen: PEN_TYPE.BASIC,
    allClearId: 0
  });

  const setColor = useCallback((color: string) => {
    setOption(item => {
      return ({ ...item, color })
    });
  }, []);

  const setPen = useCallback((pen: PEN_TYPE) => {
    setOption(item => {
      return ({ ...item, pen })
    });
  }, []);

  const onClear = useCallback(() => {
    setOption(item => {
      return ({ ...item, allClearId: item.allClearId + 1 });
    })
  }, [])

  const onCrop = () => {
    // setOption(item => {
    //   return ({ ...item, mode: (item.mode === MODE.CROP) ? MODE.DRAWING : MODE.CROP })
    // });
  }

  return (
    <>
      <Sketch width={600} height={400} options={options} />
      <div className="react-drawing-tool">
        <ul className="react-drawing-tool-pens">
          <li>
            <button onClick={() => setPen(PEN_TYPE.BASIC)}>BASIC</button>
          </li>
          <li>
            <button onClick={() => setPen(PEN_TYPE.HIGHLIGHTER)}>HIGHLIGHTER</button>
          </li>
          <li>
            <button onClick={() => setPen(PEN_TYPE.ERASER)}>ERASER</button>
          </li>
        </ul>
        <ul className="react-drawing-tool-colors">
          {
            colors.map(color => {
              return (
                <li
                  key={color}
                  style={{ backgroundColor: `${color}` }}
                  className={`item ${(color === options.color) && 'active'}`}
                  onClick={() => setColor(color)}
                >
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
        <ul>
          <li>
            <button onClick={onCrop}>Crop</button>
          </li>
        </ul>
      </div>
    </>
  );
}

export default DrawingTool;