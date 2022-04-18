import { handleChange } from "./handleChange";

const DEBOUNCE_DELAY = 16 // ms

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
};

export type KnobOptions = typeof DefaultOptions & {
  callback?: (value: number) => void
};

export class Knob {
  options: KnobOptions
  _canvas: HTMLCanvasElement
  _ctx: CanvasRenderingContext2D
  _input: HTMLInputElement
  _label: HTMLSpanElement
  _div: HTMLDivElement
  _animating: boolean
  _renderedValue: number
  _timeout: number

  constructor(knobOptions: Partial<KnobOptions>){
    const options = { ...DefaultOptions, ...knobOptions };
    this.options = options

    // Create Canvas Element
    const canvas = document.createElement("canvas");
    this._canvas = canvas
    canvas.height = options.height;
    canvas.width = options.width;
    canvas.style.position = "absolute";
    this._ctx = <CanvasRenderingContext2D>canvas.getContext("2d");

    // Create Input Element
    const fontScale =
      Math.max(
        String(Math.abs(options.max)).length,
        String(Math.abs(options.min)).length,
        2
      ) + 2;

    const input = document.createElement("input");
    this._input = input
    input.value = String(options.value);
    input.disabled = options.readOnly;
    input.addEventListener("change", (e) => {
      const el = <HTMLInputElement>e.target
      this.setValue(+el.value);
    });

    const lineWidth = (options.width / 2) * options.thickness

    Object.assign(input.style, {
      position: "absolute",
      top: `${options.width / 2 - options.width / 7}px`,
      left: `${lineWidth}px`,
      width: `${options.width - lineWidth * 2}px`,
      "vertical-align": "middle",
      border: 0,
      background: "none",
      font: `bold ${((options.width / fontScale) >> 0)}px Arial`,
      "text-align": "center",
      color: options.fgColor,
      padding: "0px",
      "-webkit-appearance": "none",
      display: !options.displayInput ? "none" : "",
    });

    // Create Label Element
    const label = document.createElement("span");
    this._label = label
    Object.assign(label.style, {
      color: options.labelColor,
      position: "absolute",
      bottom: 0,
      "font-size": "80%",
      "text-align": "center",
      "pointer-events": "none",
      top: `${options.width / 2 + options.width / 8 - 3}px`,
      left: 0,
      right: 0
    })
    label.innerHTML = options.label

    // Create div element
    const div = document.createElement("div")
    this._div = div
    Object.assign(div.style, {
      display: "inline-block",
      position: "relative",
      height: `${options.height}px`,
      width: `${options.width}px`,
    })
    if (options.className) {
      div.classList.add(options.className)
    }

    div.appendChild(canvas);
    div.appendChild(input);
    div.appendChild(label);

    this._renderedValue = options.value;
    this._animating = false;

    this.draw();

    if (!options.readOnly) {
      handleChange(this);
    }
  }

  node() {
    return this._div
  }

  getValue() {
    return this.options.value
  }

  setValue(value: number, event?: boolean): void {
    value = Math.min(this.options.max, Math.max(this.options.min, value));
    this.options.value = value;
    if (!this._animating) {
      this.refreshCanvas();
    }
    if (event === true && this.options.callback) {
      /*
       * Perform debounced callback
       */
      let timeout = this._timeout;
      window.clearTimeout(timeout);
      timeout = window.setTimeout(this.options.callback, DEBOUNCE_DELAY, value);
      this._timeout = timeout;
    }
  }

  refreshCanvas() {
    if (this._renderedValue === this.options.value) {
      this._animating = false;
    } else {
      this._animating = true;
      this._renderedValue = this.options.value;
      this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
      this.draw();
      this._input.value = String(this.options.value);
      window.requestAnimationFrame(this.refreshCanvas.bind(this));
    }
  }

  draw() {
    const options = this.options
    const ctx = this._ctx

    // deg to rad
    const angleOffset = (options.angleOffset * Math.PI) / 180;
    const angleArc = (options.angleArc * Math.PI) / 180;

    const angle =
      ((options.value - options.min) * angleArc) / (options.max - options.min);

    const xy = options.width / 2;
    const lineWidth = xy * options.thickness;
    const radius = xy - lineWidth / 2;

    const startAngle = 1.5 * Math.PI + angleOffset;
    var endAngle = 1.5 * Math.PI + angleOffset + angleArc;

    let startAt = startAngle;
    let endAt = startAt + angle;

    if (options.cursor) {
      const cursorSize = (options.cursor === true)? options.thickness : options.cursor
      const cursorExt = cursorSize / 100 || 1;
      startAt = endAt - cursorExt;
      endAt = endAt + cursorExt;
    }

    ctx.lineWidth = lineWidth;
    ctx.lineCap = options.lineCap;

    ctx.beginPath();
    ctx.strokeStyle = options.bgColor;
    ctx.arc(xy, xy, radius, endAngle, startAngle, true);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = options.fgColor;
    ctx.arc(xy, xy, radius, startAt, endAt, false);
    ctx.stroke();
  }
}


