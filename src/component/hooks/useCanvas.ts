import { RefObject, useCallback, useEffect, useRef } from 'react';
import { Coordinate, MODE, Options, PEN_TYPE } from '../types';
import { getEventPos } from '../utils';

function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const getPenStyles = (type: PEN_TYPE) => {
  let obj = { compositeOperation: 'source-over', alpha: 1, lineWidth: 1 };
  switch (type) {
    case PEN_TYPE.BASIC:
      break;
    case PEN_TYPE.HIGHLIGHTER:
      obj = { ...obj, alpha: 0.2, lineWidth: 15 };
      break;
    case PEN_TYPE.ERASER:
      obj = { ...obj, compositeOperation: 'destination-out', lineWidth: 10 };
      break;
  }
  return obj;
}

export function useCanvas(options: Options): [RefObject<HTMLCanvasElement>] {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const position = useRef<Coordinate | undefined>(undefined);

  const prevOptions = usePrevious(options);

  const getCoordinates = (e: MouseEvent | TouchEvent): Coordinate | undefined => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const { posX, posY } = getEventPos(e);
    return {
      x: posX - canvas.offsetLeft,
      y: posY - canvas.offsetTop
    };
  }

  const setCoordinates = useCallback((coordinate: Coordinate | undefined) => {
    position.current = coordinate;
  }, []);

  const draw = useCallback((originCoordinate: Coordinate, newCoordinate: Coordinate) => {
    const context = canvasRef.current!.getContext('2d')!;
    context.beginPath();
    context.moveTo(originCoordinate.x, originCoordinate.y);
    context.lineTo(newCoordinate.x, newCoordinate.y);
    context.closePath();
    context.stroke();
  }, []);

  const startEvt = useCallback((e: MouseEvent | TouchEvent) => {
    const coordinate = getCoordinates(e);
    if (coordinate) {
      const context = canvasRef.current!.getContext('2d')!;

      if (options.mode === MODE.DRAWING) {
        context.lineCap = "round";
        context.lineJoin = "round";
        context.strokeStyle = options.color;
        const { compositeOperation, alpha, lineWidth } = getPenStyles(options.pen);
        context.globalCompositeOperation = compositeOperation;
        context.lineWidth = lineWidth;
        context.globalAlpha = alpha;
      } else if (options.mode === MODE.CROP) {

      }

      setCoordinates(coordinate);
    }
  }, [options, setCoordinates]);

  const moveEvt = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const newPosition = getCoordinates(e);
    if (position && position.current && newPosition) {
      draw(position.current, newPosition);
      setCoordinates(newPosition);
    }
  }, [draw, setCoordinates]);

  const endEvt = useCallback(() => {
    setCoordinates(undefined);
  }, [setCoordinates]);

  useEffect(() => {
    if (canvasRef.current && prevOptions?.allClearId !== options.allClearId) {
      const context = canvasRef.current.getContext('2d')!;
      const width = canvasRef.current.width;
      const height = canvasRef.current.height;
      context.clearRect(0, 0, width, height);
    }
  }, [prevOptions?.allClearId, options.allClearId]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.addEventListener('mousedown', startEvt, { passive: false });
    canvas.addEventListener('mousemove', moveEvt, { passive: false });
    canvas.addEventListener('mouseup', endEvt, { passive: false });
    canvas.addEventListener('mouseleave', endEvt, { passive: false });

    canvas.addEventListener('touchstart', startEvt, { passive: false });
    canvas.addEventListener('touchmove', moveEvt, { passive: false })
    canvas.addEventListener('touchend', endEvt, { passive: false })
    canvas.addEventListener('touchcancel', endEvt, { passive: false })
    return () => {
      canvas.removeEventListener('mousedown', startEvt);
      canvas.removeEventListener('mousemove', moveEvt);
      canvas.removeEventListener('mouseup', endEvt);
      canvas.removeEventListener('mouseleave', endEvt);

      canvas.removeEventListener('touchstart', startEvt);
      canvas.removeEventListener('touchmove', moveEvt)
      canvas.removeEventListener('touchend', endEvt)
      canvas.removeEventListener('touchcancel', endEvt)
    };
  }, [startEvt, moveEvt, endEvt]);

  return [canvasRef];
}
