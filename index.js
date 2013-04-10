var extend = require("xtend")
var h = require('hyperscript')

var handleChange = require('./handle_change')

module.exports = function(options){

  options = extend({
    value: 50,

    min: 0,
    max: 100,
    step: 1,

    cursor: false,
    thickness: 0.35,
    lineCap: 'butt',

    width: 200,
    height: options.width || 200,

    bgColor: '#EEEEEE',
    fgColor: '#87CEEB',
    labelColor: '#888',

    angleOffset: 0, 
    angleArc: 360,

    className: null,
    activeClass: null

  }, options)

  var canvas = h('canvas', {
    height: options.height, 
    width: options.width, 
    style: {'position': 'absolute'}
  })

  var context2d = canvas.getContext("2d")

  var fontScale = Math.max(String(Math.abs(options.max)).length, String(Math.abs(options.min)).length, 2) + 2

  var input = h('input', {value: options.value, style: {
    'position' : 'absolute',
    'top': (options.width / 2) - (options.width / 8),
    'bottom': (options.width / 2) - (options.width / 8),
    'left': getLineWidth(options),
    'right': getLineWidth(options),
    'vertical-align' : 'middle',
    'border' : 0,
    'background' : 'none',
    'font' : 'bold ' + ((options.width / fontScale) >> 0) + 'px Arial',
    'text-align' : 'center',
    'color' : options.fgColor,
    'padding' : '0px',
    '-webkit-appearance': 'none'
  }})

  var label = h('span', {style: {
    'color': options.labelColor,
    'position': 'absolute',
    'bottom': 0,
    'font-size': '60%',
    'font-family': 'Arial',
    'text-align': 'center',
    'pointer-events': 'none',
    'top': (options.width / 2) + (options.width / 8) - 3,
    'left': 0,
    'right': 0
  }}, options.label)

  var element = h('div', { className: options.className,
    style: {'display': 'inline-block', 'position': 'relative', 'height': options.height + 'px', 'width': options.width + 'px'}
  }, canvas, input, label)

  element.canvas = canvas
  element.options = options

  var renderedValue = options.value
  var animating = false

  element.setValue = function(value){
    value = Math.min(options.max, Math.max(options.min, value))
    options.value = value
    if (!animating){
      refreshCanvas()
    }
  }

  element.getValue = function(){
    return options.value
  }

  input.onchange = function(){
    element.setValue(this.value)
  }

  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

  function refreshCanvas(){
    if (renderedValue === options.value){
      animating = false
    } else {
      animating = true
      renderedValue = options.value
      context2d.clearRect(0, 0, canvas.width, canvas.height)
      draw(context2d, options)
      input.value = options.value
      requestAnimationFrame.call(window, refreshCanvas)
    }
  }

  draw(context2d, options)

  handleChange(element)

  return element
}

function getLineWidth(options){
  var xy = options.width / 2
  return xy * options.thickness
}

function draw(context2d, options){
  // deg to rad
  var angleOffset = options.angleOffset * Math.PI / 180
  var angleArc = options.angleArc * Math.PI / 180

  var angle = (options.value - options.min) * angleArc / (options.max - options.min)

  var xy = options.width / 2
  var lineWidth = xy * options.thickness
  var radius = xy - lineWidth / 2;

  var startAngle = 1.5 * Math.PI + angleOffset;
  var endAngle = 1.5 * Math.PI + angleOffset + angleArc;

  var startAt = startAngle
  var endAt = startAt + angle  

  if (options.cursor){
    var cursorExt = (options.cursor / 100) || 1;
    startAt = endAt - cursorExt
    endAt = endAt + cursorExt
  }

  context2d.lineWidth = lineWidth
  context2d.lineCap = options.lineCap;

  context2d.beginPath()
    context2d.strokeStyle = options.bgColor
    context2d.arc(xy, xy, radius, endAngle, startAngle, true)
  context2d.stroke()

  context2d.beginPath()
    context2d.strokeStyle = options.fgColor
    context2d.arc(xy, xy, radius, startAt, endAt, false)
  context2d.stroke()
}

