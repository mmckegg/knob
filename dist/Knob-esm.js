function $b0b357e1eb3008cd$export$1ba2cb844e41b315(knob) {
    const D_listen = document.addEventListener;
    const D_mute = document.removeEventListener;
    const canvas = knob.canvas;
    const options = knob.options;
    const activeClass = options.activeClass;
    canvas.onpointerdown = function(e1) {
        e1.preventDefault();
        const offset = $b0b357e1eb3008cd$var$getOffset(canvas);
        function pointerMove(e) {
            knob.setValue($b0b357e1eb3008cd$var$xyToValue(options, e.pageX, e.pageY, offset), true);
        }
        function pointerUp(e) {
            if (activeClass) knob.classList.remove(activeClass);
            D_mute("pointermove", pointerMove);
            D_mute("pointerup", pointerUp);
        }
        if (activeClass) knob.classList.add(activeClass);
        D_listen("pointermove", pointerMove);
        D_listen("pointerup", pointerUp);
        pointerMove(e1);
    };
}
function $b0b357e1eb3008cd$var$xyToValue(options, x, y, offset) {
    const PI2 = 2 * Math.PI;
    const w2 = options.width / 2;
    const angleArc = options.angleArc * Math.PI / 180;
    const angleOffset = options.angleOffset * Math.PI / 180;
    let angle = Math.atan2(x - (offset.x + w2), -(y - offset.y - w2)) - angleOffset;
    if (angleArc !== PI2 && angle < 0 && angle > -0.5) angle = 0;
    else if (angle < 0) angle += PI2;
    const result = ~~(0.5 + angle * (options.max - options.min) / angleArc) + options.min;
    return Math.max(Math.min(result, options.max), options.min);
}
function $b0b357e1eb3008cd$var$getOffset(el) {
    const result = {
        x: 0,
        y: 0
    };
    while(el){
        result.x += el.offsetLeft;
        result.y += el.offsetTop;
        el = el.offsetParent;
    }
    return result;
}


const $1d7aa38aa6635e2a$var$DEBOUNCE_DELAY = 10 // ms
;
const $1d7aa38aa6635e2a$var$DefaultOptions = {
    value: 50,
    min: 0,
    max: 100,
    step: 1,
    cursor: false,
    thickness: 0.35,
    lineCap: "butt",
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
    activeClass: ""
};
function $1d7aa38aa6635e2a$export$2403d36fd4a1a72(knobOptions) {
    const options = {
        ...$1d7aa38aa6635e2a$var$DefaultOptions,
        ...knobOptions
    };
    // Create Canvas Element
    const canvas = document.createElement("canvas");
    canvas.height = options.height;
    canvas.width = options.width;
    canvas.style.position = "absolute";
    const ctx = canvas.getContext("2d");
    // Create Input Element
    const fontScale = Math.max(String(Math.abs(options.max)).length, String(Math.abs(options.min)).length, 2) + 2;
    const input = document.createElement("input");
    input.value = String(options.value);
    input.disabled = options.readOnly;
    const lineWidth = options.width / 2 * options.thickness;
    Object.assign(input.style, {
        position: "absolute",
        top: `${options.width / 2 - options.width / 7}px`,
        left: `${lineWidth}px`,
        width: `${options.width - lineWidth * 2}px`,
        "vertical-align": "middle",
        border: 0,
        background: "none",
        font: `bold ${options.width / fontScale >> 0}px Arial`,
        "text-align": "center",
        color: options.fgColor,
        padding: "0px",
        "-webkit-appearance": "none",
        display: !options.displayInput ? "none" : ""
    });
    // Create Label Element
    const label = document.createElement("span");
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
    });
    label.innerHTML = options.label;
    // Create div element
    const div = document.createElement("div");
    Object.assign(div.style, {
        display: "inline-block",
        position: "relative",
        height: `${options.height}px`,
        width: `${options.width}px`,
        "touch-action": "none"
    });
    if (options.className) div.classList.add(options.className);
    div.appendChild(canvas);
    div.appendChild(input);
    div.appendChild(label);
    // Attach HTML Elements to the div element
    Object.assign(div, {
        options: options,
        canvas: canvas,
        input: input,
        label: label
    });
    let renderedValue = options.value;
    let animating = false;
    let _timeout;
    function refreshCanvas() {
        if (renderedValue === options.value) animating = false;
        else {
            animating = true;
            renderedValue = options.value;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            $1d7aa38aa6635e2a$var$draw(options, ctx);
            input.value = String(options.value);
            window.requestAnimationFrame(refreshCanvas);
        }
    }
    // Attach methods to the div
    div.getValue = ()=>options.value
    ;
    div.setValue = (value, event)=>{
        value = Math.min(options.max, Math.max(options.min, value));
        options.value = value;
        div.value = value;
        if (!animating) refreshCanvas();
        if (event === true && div.onchange) {
            /*
       * Perform debounced callback
       */ let timeout = _timeout;
            window.clearTimeout(timeout);
            timeout = window.setTimeout(div.onchange, $1d7aa38aa6635e2a$var$DEBOUNCE_DELAY);
            _timeout = timeout;
        }
    };
    input.addEventListener("change", (e)=>{
        const el = e.target;
        div.setValue?.(+el.value);
    });
    $1d7aa38aa6635e2a$var$draw(options, ctx);
    if (!options.readOnly) $b0b357e1eb3008cd$export$1ba2cb844e41b315(div);
    return div;
}
function $1d7aa38aa6635e2a$var$draw(options, ctx) {
    // deg to rad
    const angleOffset = options.angleOffset * Math.PI / 180;
    const angleArc = options.angleArc * Math.PI / 180;
    const angle = (options.value - options.min) * angleArc / (options.max - options.min);
    const xy = options.width / 2;
    const lineWidth = xy * options.thickness;
    const radius = xy - lineWidth / 2;
    const startAngle = 1.5 * Math.PI + angleOffset;
    const endAngle = 1.5 * Math.PI + angleOffset + angleArc;
    let startAt = startAngle;
    let endAt = startAt + angle;
    if (options.cursor) {
        const cursorSize = options.cursor === true ? options.thickness : options.cursor;
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


export {$1d7aa38aa6635e2a$export$2403d36fd4a1a72 as Knob};
//# sourceMappingURL=Knob-esm.js.map
