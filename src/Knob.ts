import { handleChange } from "./handleChange"

const DEBOUNCE_DELAY = 10 // ms

type CursorType = boolean | number

const DefaultOptions = {
  value: 50,

  min: 0,
  max: 100,
  step: 1,

  cursor: <CursorType>false,
  thickness: 0.35,
  lineCap: <CanvasRenderingContext2D["lineCap"]>"butt",
  readOnly: false,
  displayInput: true,

  width: 200,
  height: 200,

  bgColor: "#EEEEEE",
  fgColor: "#87CEEB",
  label: "",
  labelColor: "#888",

  angleOffset: 0,
  angleArc: 360,

  className: "",
  activeClass: "",
}

export type KnobOptions = typeof DefaultOptions

type KnobProperties = {
  options: KnobOptions
  canvas: HTMLCanvasElement
  input: HTMLInputElement
  label: HTMLSpanElement
  value: number
  getValue: () => number
  setValue: (value: number, event?: boolean) => void
}

type ProtoKnob = Partial<KnobProperties> & HTMLDivElement
export type KnobElement = KnobProperties & HTMLDivElement

export function Knob(knobOptions: Partial<KnobOptions>): KnobElement {
  const options = { ...DefaultOptions, ...knobOptions }

  // Create Canvas Element
  const canvas = document.createElement("canvas")
  canvas.height = options.height
  canvas.width = options.width
  canvas.style.position = "absolute"
  const ctx = <CanvasRenderingContext2D>canvas.getContext("2d")

  // Create Input Element
  const fontScale =
    Math.max(
      String(Math.abs(options.max)).length,
      String(Math.abs(options.min)).length,
      2
    ) + 2

  const input = document.createElement("input")
  input.value = String(options.value)
  input.disabled = options.readOnly

  const lineWidth = (options.width / 2) * options.thickness

  Object.assign(input.style, {
    position: "absolute",
    top: `${options.width / 2 - options.width / 7}px`,
    left: `${lineWidth}px`,
    width: `${options.width - lineWidth * 2}px`,
    "vertical-align": "middle",
    border: 0,
    background: "none",
    font: `bold ${(options.width / fontScale) >> 0}px Arial`,
    "text-align": "center",
    color: options.fgColor,
    padding: "0px",
    "-webkit-appearance": "none",
    display: !options.displayInput ? "none" : "",
  })

  // Create Label Element
  const label = document.createElement("span")
  Object.assign(label.style, {
    color: options.labelColor,
    position: "absolute",
    bottom: 0,
    "font-size": "80%",
    "text-align": "center",
    "pointer-events": "none",
    top: `${options.width / 2 + options.width / 8 - 3}px`,
    left: 0,
    right: 0,
  })
  label.innerHTML = options.label

  // Create div element
  const div: ProtoKnob = document.createElement("div")
  Object.assign(div.style, {
    display: "inline-block",
    position: "relative",
    height: `${options.height}px`,
    width: `${options.width}px`,
    "touch-action": "none",
  })
  if (options.className) {
    div.classList.add(options.className)
  }

  div.appendChild(canvas)
  div.appendChild(input)
  div.appendChild(label)

  // Attach HTML Elements to the div element
  Object.assign(div, { options, canvas, input, label })

  let renderedValue = options.value
  let animating = false
  let _timeout: number

  function refreshCanvas() {
    if (renderedValue === options.value) {
      animating = false
    } else {
      animating = true
      renderedValue = options.value
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      draw(options, ctx)
      input.value = String(options.value)
      window.requestAnimationFrame(refreshCanvas)
    }
  }

  // Attach methods to the div
  div.getValue = () => options.value

  div.setValue = (value: number, event?: boolean) => {
    value = Math.min(options.max, Math.max(options.min, value))
    options.value = value
    div.value = value
    if (!animating) {
      refreshCanvas()
    }
    if (event === true && div.onchange) {
      /*
       * Perform debounced callback
       */
      let timeout = _timeout
      window.clearTimeout(timeout)
      timeout = window.setTimeout(div.onchange, DEBOUNCE_DELAY)
      _timeout = timeout
    }
  }

  input.addEventListener("change", (e) => {
    const el = <HTMLInputElement>e.target
    div.setValue?.(+el.value)
  })

  draw(options, ctx)

  if (!options.readOnly) {
    handleChange(<KnobElement>div)
  }

  return <KnobElement>div
}

function draw(options: KnobOptions, ctx: CanvasRenderingContext2D) {
  // deg to rad
  const angleOffset = (options.angleOffset * Math.PI) / 180
  const angleArc = (options.angleArc * Math.PI) / 180

  const angle =
    ((options.value - options.min) * angleArc) / (options.max - options.min)

  const xy = options.width / 2
  const lineWidth = xy * options.thickness
  const radius = xy - lineWidth / 2

  const startAngle = 1.5 * Math.PI + angleOffset
  const endAngle = 1.5 * Math.PI + angleOffset + angleArc

  let startAt = startAngle
  let endAt = startAt + angle

  if (options.cursor) {
    const cursorSize =
      options.cursor === true ? options.thickness : options.cursor
    const cursorExt = cursorSize / 100 || 1
    startAt = endAt - cursorExt
    endAt = endAt + cursorExt
  }

  ctx.lineWidth = lineWidth
  ctx.lineCap = options.lineCap

  ctx.beginPath()
  ctx.strokeStyle = options.bgColor
  ctx.arc(xy, xy, radius, endAngle, startAngle, true)
  ctx.stroke()

  ctx.beginPath()
  ctx.strokeStyle = options.fgColor
  ctx.arc(xy, xy, radius, startAt, endAt, false)
  ctx.stroke()
}
