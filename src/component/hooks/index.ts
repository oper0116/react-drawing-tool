import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { Coordinate, Options, PEN_TYPE } from '../types';
import { getEventPos } from '../utils';



export function useCanvas(options: Options): [RefObject<HTMLCanvasElement>] {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [position, setPosition] = useState<Coordinate | undefined>(undefined);

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

  const getCompositeOperation = (penType: PEN_TYPE) => {
    return penType === PEN_TYPE.ERASER ? 'destination-out' : 'source-over';
  }

  const getLineWidth = (penType: PEN_TYPE): number => {
    switch (penType) {
      case PEN_TYPE.BASIC:
        return 1;
      case PEN_TYPE.HIGHLIGHTER:
        return 5;
      case PEN_TYPE.ERASER:
        return 4;
    }
  }

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
      context.strokeStyle = options.color;
      context.globalCompositeOperation = getCompositeOperation(options.pen);
      context.lineWidth = getLineWidth(options.pen);

      setPosition(coordinate);
    }
  }, [options]);

  const paint = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const newPosition = getCoordinates(e);
    if (position && newPosition) {
      draw(position, newPosition);
      setPosition(newPosition);
    }
  }, [position, draw]);

  const endPaint = useCallback(() => {
    setPosition(undefined);
  }, [])

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
