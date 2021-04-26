import { RefObject, useCallback, useEffect, useRef } from 'react';
import { Coordinate, Options, PEN_TYPE } from '../types';
import { getEventPos } from '../utils';


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

let position: Coordinate | undefined = undefined;

export function useCanvas(options: Options): [RefObject<HTMLCanvasElement>] {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    position = coordinate;
  }, []);

  const draw = useCallback((originCoordinate: Coordinate, newCoordinate: Coordinate) => {
    const context = canvasRef.current!.getContext('2d')!;
    context.beginPath();
    context.moveTo(originCoordinate.x, originCoordinate.y);
    context.lineTo(newCoordinate.x, newCoordinate.y);
    context.closePath();
    context.stroke();
  }, []);

  const startPaint = useCallback((e: MouseEvent | TouchEvent) => {
    const coordinate = getCoordinates(e);
    if (coordinate) {
      const context = canvasRef.current!.getContext('2d')!;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.strokeStyle = options.color;
      const { compositeOperation, alpha, lineWidth } = getPenStyles(options.pen);
      context.globalCompositeOperation = compositeOperation;
      context.lineWidth = lineWidth;
      context.globalAlpha = alpha;
      setCoordinates(coordinate);
    }
  }, [options, setCoordinates]);

  const paint = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const newPosition = getCoordinates(e);
    if (position && newPosition) {
      draw(position, newPosition);
      setCoordinates(newPosition);
    }
  }, [draw, setCoordinates]);

  const endPaint = useCallback(() => {
    setCoordinates(undefined);
  }, [setCoordinates]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.addEventListener('mousedown', startPaint);
    canvas.addEventListener('mousemove', paint);
    canvas.addEventListener('mouseup', endPaint);
    canvas.addEventListener('mouseleave', endPaint);

    canvas.addEventListener('touchstart', startPaint);
    canvas.addEventListener('touchmove', paint)
    canvas.addEventListener('touchend', endPaint)
    canvas.addEventListener('touchcancel', endPaint)
    return () => {
      canvas.removeEventListener('mousedown', startPaint);
      canvas.removeEventListener('mousemove', paint);
      canvas.removeEventListener('mouseup', endPaint);
      canvas.removeEventListener('mouseleave', endPaint);

      canvas.removeEventListener('touchstart', startPaint);
      canvas.removeEventListener('touchmove', paint)
      canvas.removeEventListener('touchend', endPaint)
      canvas.removeEventListener('touchcancel', endPaint)
    };
  }, [startPaint, paint, endPaint]);

  return [canvasRef];
}
