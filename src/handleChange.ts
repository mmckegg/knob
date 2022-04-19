import type { KnobElement, KnobOptions } from "./Knob"

export function handleChange(knob: KnobElement) {
  const D_listen = document.addEventListener
  const D_mute = document.removeEventListener
  const canvas = <HTMLCanvasElement>knob.canvas
  const options = <KnobOptions>knob.options
  const activeClass = options.activeClass

  canvas.onpointerdown = function (e: PointerEvent) {
    e.preventDefault()
    const offset = getOffset(canvas)

    function pointerMove(e: PointerEvent) {
      knob.setValue(xyToValue(options, e.pageX, e.pageY, offset), true)
    }

    function pointerUp(e: PointerEvent) {
      if (activeClass) {
        knob.classList.remove(activeClass)
      }
      D_mute("pointermove", pointerMove)
      D_mute("pointerup", pointerUp)
    }

    if (activeClass) {
      knob.classList.add(activeClass)
    }

    D_listen("pointermove", pointerMove)
    D_listen("pointerup", pointerUp)

    pointerMove(e)
  }
}

type point2D = { x: number; y: number }
function xyToValue(
  options: KnobOptions,
  x: number,
  y: number,
  offset: point2D
) {
  const PI2 = 2 * Math.PI
  const w2 = options.width / 2
  const angleArc = (options.angleArc * Math.PI) / 180
  const angleOffset = (options.angleOffset * Math.PI) / 180

  let angle =
    Math.atan2(x - (offset.x + w2), -(y - offset.y - w2)) - angleOffset

  if (angleArc !== PI2 && angle < 0 && angle > -0.5) {
    angle = 0
  } else if (angle < 0) {
    angle += PI2
  }

  const result =
    ~~(0.5 + (angle * (options.max - options.min)) / angleArc) + options.min
  return Math.max(Math.min(result, options.max), options.min)
}

function getOffset(el: HTMLCanvasElement) {
  const result: point2D = { x: 0, y: 0 }
  while (el) {
    result.x += el.offsetLeft
    result.y += el.offsetTop
    el = <HTMLCanvasElement>el.offsetParent
  }

  return result
}
