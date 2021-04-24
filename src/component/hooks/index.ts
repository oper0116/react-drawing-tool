import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { getEventPos } from '../utils';

interface Coordinate {
  x: number;
  y: number;
}

export function useCanvas(): [RefObject<HTMLCanvasElement>] {

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
      setPosition(coordinate);
    }
  }, []);

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
