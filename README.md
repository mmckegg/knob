# Knob

Canvas knob widget for the browser (touch compatible). Based on [jQuery Knob](http://anthonyterrien.com/knob) by Anthony Terrien.

## Install

```bash
$ npm install knob
```

## Example

```js
import { Knob } from "pure-knob"

const knob = Knob({
  label: "Test 123",
  value: 100,
  angleOffset: -125,
  angleArc: 250,
  min: 0,
  max: 200,
  width: 100,
  callback: (val) => console.log(val)
});

document.getElementById("container").appendChild(knob.node);
```

Run the included example:

```bash
$ npm run example
# then navigate to http://localhost:xxxxx
```

## All Supported Options and Default Values

- value (`50`)
- min (`0`)
- max (`100`)
- step (`1`),
- cursor (`false`),
- thickness (`0.35`),
- lineCap: (`'butt'`),
- width (`200`),
- height (`options.width || 200`)
- bgColor (`'#EEEEEE'`)
- fgColor (`'#87CEEB'`)
- labelColor (`'#888'`)
- angleOffset (`0`)
- angleArc (`360`)
- className (`null`)
- activeClass (`null`)
- readOnly (`false`)

## License

MIT
