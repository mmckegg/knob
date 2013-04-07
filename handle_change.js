var ever = require('ever')

module.exports = function(knob){
  var documentEvents = ever(window.document)

  ever(knob.canvas).on('mousedown', function(e){
    e.preventDefault()

    var offset = getOffset(knob.canvas)

    function mouseMove(e) {
      knob.setValue(xyToValue(knob.options, e.pageX, e.pageY, offset))
    }

    documentEvents.on('mousemove', mouseMove).once('mouseup', function(){
      documentEvents.removeListener('mousemove', mouseMove)
    })

    mouseMove(e)

  }).on('touchstart', function(e){
    e.preventDefault()

    var touchIndex = e.touches.length - 1
    var offset = getOffset(knob.canvas)

    function touchMove(e){
      knob.setValue(
        xyToValue(knob.options, e.touches[touchIndex].pageX, e.touches[touchIndex].pageY, offset)
      )
    }

    documentEvents.on('touchmove', touchMove).once('touchend', function(){
      documentEvents.removeListener('touchmove', touchMove)
    })

    touchMove(e)
  })
}

function xyToValue(options, x, y, offset){
  var PI2 = 2*Math.PI
  var w2 = options.width / 2
  var angleArc = options.angleArc * Math.PI / 180
  var angleOffset = options.angleOffset * Math.PI / 180;

  var angle = Math.atan2(x - (offset.x + w2), - (y - offset.y - w2)) - angleOffset

  if(angleArc != PI2 && (angle < 0) && (angle > -0.5)) {
    angle = 0
  } else if (angle < 0) {
    angle += PI2
  }

  var result = ~~ (0.5 + (angle * (options.max - options.min) / angleArc)) + options.min;
  return Math.max(Math.min(result, options.max), options.min)
}

function getOffset(element){
  var result = {x: 0, y: 0};
  while (element) {
    result.x += element.offsetLeft
    result.y += element.offsetTop
    element = element.offsetParent
  } 

  return result
}