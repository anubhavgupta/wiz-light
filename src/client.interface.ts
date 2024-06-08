type ParseInt<T extends string> 
  = T extends `${infer Digit extends number}`
  ? Digit
  : "never";

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

type Uint8 = Enumerate<256>;

type IColorRange = Uint8;
type IPAdd<S extends string> = S extends `${infer A}.${infer B}.${infer C}.${infer D}` ? 
        (
            (ParseInt<A> extends Uint8 ? S : never) &
            (ParseInt<B> extends Uint8 ? S : never) &
            (ParseInt<C> extends Uint8 ? S : never) &
            (ParseInt<D> extends Uint8 ? S : never) 
        ) extends never ? "Invalid IPv4 value" : S
    : "Invalid IPv4 format";


type IBrightnessRange = Enumerate<101>;
type IStatus = Boolean;

interface IWizLightOptions {
    port?: number;
    statusCheckTimeout?: number;
    retryTimes?: number;
}

// https://www.upshine.com/blog/what-rgb-rgbw-rgbcw-smart-light.html
type ILightProps = {
    status?: boolean;
    r?: IColorRange;
    g?: IColorRange;
    b?: IColorRange;
    c?: IColorRange;
    w?: IColorRange;
    dimming?: IBrightnessRange;
}

interface IWizLight {
    setLightStatus(status: IStatus): Promise<IStatus>;
    setLightProps(props: ILightProps): Promise<IStatus>;
    destroy(): void;
}

interface IResponse {
    id: number;
    method: string;
    env: string;
    result?: {
        success: boolean
    }
    error?: {
        code: number;
        message: string
    }
}

interface IFullStateResponse {
    id: number;
    method: string;
    env: string;
    result: {
        mac: string;
        rssi: string;
        src: string;
        state: string;
        sceneId: number;
        r: IColorRange;
        g: IColorRange;
        b: IColorRange;
        c: IColorRange;
        w: IColorRange;
        dimming: IBrightnessRange;
    }
}


export {
    IWizLight,
    IWizLightOptions,
    ILightProps,
    IColorRange,
    IStatus,
    IBrightnessRange,
    IResponse,
    IFullStateResponse,
    IPAdd
}