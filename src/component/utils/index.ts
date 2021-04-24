export function getEventPos(e: Event): { posX: number, posY: number } {
  let posX = 0;
  let posY = 0;
  if (e instanceof MouseEvent) {
    posX = e.pageX;
    posY = e.pageY;
  } else if (e instanceof TouchEvent) {
    posX = e.changedTouches[0].pageX;
    posY = e.changedTouches[0].pageY;
  }

  return { posX, posY };
}