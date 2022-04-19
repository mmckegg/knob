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

//# sourceMappingURL=Knob.d.ts.map
