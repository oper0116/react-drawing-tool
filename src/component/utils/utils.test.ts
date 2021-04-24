import { createEvent } from "@testing-library/react";
import { getEventPos } from ".";

describe('utils 테스트', () => {
  test('getEventPos', () => {
    // TODO
    // pageX 
    const evt = createEvent.mouseDown(document, {
      // pageXOffset: 200,
      // pageYOffset: 300,
      clientX: 200,
      pageY: 200
    });

    // console.debug('evt : ', evt);
    // console.debug('evt.clientX : ', evt.clientX);
    // console.debug('evt.pageY : ', evt.pageY);
    // const pos = getEventPos(evt);
    // console.debug('pos: ', pos);
  });
})

