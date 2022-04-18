import { Knob } from "./Knob"
import type { KnobOptions } from "./Knob"

export function handleChange(knob: Knob) {
  const D_listen = document.addEventListener
  const D_mute = document.removeEventListener
  const K_listen = knob._canvas.addEventListener
  const K_mute = knob._canvas.removeEventListener
  const canvas = knob._canvas
  const activeClass = knob.options.activeClass;

  canvas.onmousedown =  function (e: MouseEvent) {
    e.preventDefault();
    const offset = getOffset(knob._canvas);

    function mouseMove(e: MouseEvent) {
      knob.setValue(xyToValue(knob.options, e.pageX, e.pageY, offset), true);
    }

    function mouseUp(e: MouseEvent) {
      if (activeClass) {
        knob._div.classList.remove(activeClass);
      }
      D_mute("mousemove", mouseMove);
      D_mute("mouseup", mouseUp);
    }

    if (activeClass) {
      knob._div.classList.add(activeClass);
    }

    D_listen("mousemove", mouseMove);
    D_listen("mouseup", mouseUp);

    mouseMove(e);
  }

  canvas.ontouchstart =  function (e: TouchEvent) {
    e.preventDefault();

    const touchIndex = e.touches.length - 1;
    const offset = getOffset(knob._canvas);

    function touchMove(e: TouchEvent) {
      knob.setValue(
        xyToValue(
          knob.options,
          e.touches[touchIndex].pageX,
          e.touches[touchIndex].pageY,
          offset
        ),
        true
      );
    }

    function touchEnd() {
      if (activeClass) {
        knob._div.classList.remove(activeClass);
      }
      D_mute("touchmove", touchMove);
      D_mute("touchend", touchEnd);
    }

    if (activeClass) {
      knob._div.classList.add(activeClass);
    }

    D_listen("touchmove", touchMove);
    D_listen("touchend", touchEnd);

    touchMove(e);
  }
};

type point2D = { x: number, y: number }
function xyToValue(options: KnobOptions, x: number, y: number, offset: point2D) {
  const PI2 = 2 * Math.PI;
  const w2 = options.width / 2;
  const angleArc = (options.angleArc * Math.PI) / 180;
  const angleOffset = (options.angleOffset * Math.PI) / 180;

  let angle =
    Math.atan2(x - (offset.x + w2), -(y - offset.y - w2)) - angleOffset;

  if (angleArc !== PI2 && angle < 0 && angle > -0.5) {
    angle = 0;
  } else if (angle < 0) {
    angle += PI2;
  }

  const result =
    ~~(0.5 + (angle * (options.max - options.min)) / angleArc) + options.min;
  return Math.max(Math.min(result, options.max), options.min);
}

function getOffset(element: HTMLCanvasElement) {
  const result = { x: 0, y: 0 };
  while (element) {
    result.x += element.offsetLeft;
    result.y += element.offsetTop;
    element = <HTMLCanvasElement>element.offsetParent;
  }

  return result;
}
