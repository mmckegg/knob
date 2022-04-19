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
export type KnobOptions = typeof DefaultOptions & {
    callback?: (value: number) => void;
};
export class Knob {
    options: KnobOptions;
    _canvas: HTMLCanvasElement;
    _ctx: CanvasRenderingContext2D;
    _input: HTMLInputElement;
    _label: HTMLSpanElement;
    _div: HTMLDivElement;
    _animating: boolean;
    _renderedValue: number;
    constructor(knobOptions: Partial<KnobOptions>);
    node(): HTMLDivElement;
    getValue(): number;
    setValue(value: number, event?: boolean): void;
    refreshCanvas(): void;
    draw(): void;
}

//# sourceMappingURL=types.d.ts.map
