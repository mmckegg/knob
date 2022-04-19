# Knob

Canvas knob widget for the browser (touch compatible) with zero runtime dependencies, in modern TypeScript using the new [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) API for simplicity. Based on [jQuery Knob](http://anthonyterrien.com/knob) by Anthony Terrien.

## Install

```bash
$ npm install knob
```

## Example

```ts
import { Knob } from "knob"; // or Knob = require("Knob")

const knob = Knob({
  label: "Test 123",
  value: 100,
  angleOffset: -125,
  angleArc: 250,
  min: 0,
  max: 200,
  width: 100,
});

document.getElementById("container").appendChild(knob);
```

Run the included example:

```bash
$ npm run example
# then navigate to http://localhost:9966
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
- className (`""`)
- activeClass (`""`)
- readOnly (`false`)

## Types
From [./dist/Knob.d.ts](./dist/Knob.d.ts)

```ts
type CursorType = boolean | number;
declare const DefaultOptions: {
  value: number;
  min: number;
  max: number;
  step: number;
  cursor: CursorType;
  thickness: number;
  lineCap: CanvasLineCap;
  readOnly: boolean;
  displayInput: boolean;
  width: number;
  height: number;
  bgColor: string;
  fgColor: string;
  label: string;
  labelColor: string;
  angleOffset: number;
  angleArc: number;
  className: string;
  activeClass: string;
};
export type KnobOptions = typeof DefaultOptions;
type KnobProperties = {
  options: KnobOptions;
  canvas: HTMLCanvasElement;
  input: HTMLInputElement;
  label: HTMLSpanElement;
  value: number;
  getValue: () => number;
  setValue: (value: number, event?: boolean) => void;
};
export type KnobElement = KnobProperties & HTMLDivElement;
export function Knob(knobOptions: Partial<KnobOptions>): KnobElement;
```

## License

MIT
