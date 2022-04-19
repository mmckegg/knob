import type { KnobElement,  KnobOptions } from "./Knob"

export function handleChange(knob: KnobElement) {
  const D_listen = document.addEventListener
  const D_mute = document.removeEventListener
  const canvas = <HTMLCanvasElement>knob.canvas
  const options = <KnobOptions>knob.options
  const activeClass = options.activeClass;

  canvas.onmousedown =  function (e: MouseEvent) {
    e.preventDefault();
    const offset = getOffset(canvas);

    function mouseMove(e: MouseEvent) {
      knob.setValue(xyToValue(options, e.pageX, e.pageY, offset), true);
    }

    function mouseUp(e: MouseEvent) {
      if (activeClass) {
        knob.classList.remove(activeClass);
      }
      D_mute("mousemove", mouseMove);
      D_mute("mouseup", mouseUp);
    }

    if (activeClass) {
      knob.classList.add(activeClass);
    }

    D_listen("mousemove", mouseMove);
    D_listen("mouseup", mouseUp);

    mouseMove(e);
  }

  canvas.ontouchstart =  function (e: TouchEvent) {
    e.preventDefault();

    const touchIndex = e.touches.length - 1;
    const offset = getOffset(canvas);

    function touchMove(e: TouchEvent) {
      knob.setValue(
        xyToValue(
          options,
          e.touches[touchIndex].pageX,
          e.touches[touchIndex].pageY,
          offset
        ),
        true
      );
    }

    function touchEnd() {
      if (activeClass) {
        knob.classList.remove(activeClass);
      }
      D_mute("touchmove", touchMove);
      D_mute("touchend", touchEnd);
    }

    if (activeClass) {
      knob.classList.add(activeClass);
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

function getOffset(el: HTMLCanvasElement) {
  const result: point2D = { x: 0, y: 0 };
  while (el) {
    result.x += el.offsetLeft;
    result.y += el.offsetTop;
    el = <HTMLCanvasElement>el.offsetParent;
  }

  return result;
}
