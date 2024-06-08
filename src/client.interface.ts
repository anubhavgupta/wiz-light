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
    /**
     * Port number; 
     * Default is 38899
     */
    port?: number;
    /**
     * As all the communication happens over UDP, there is no direct response to the request.
     * We have to wait for some time to receive a message from the device to know if the request was served or not, post 
     * that time the request is considered as failed and retry mechanism kicks in.
     * 
     * This represents the time that we should wait before retrying.
     * Default is 1000ms
     */
    statusCheckTimeout?: number;
    /**
     * Number of times we should retry a request in case of a failure.
     * Default is 5
     */
    retryTimes?: number;
}

// https://www.upshine.com/blog/what-rgb-rgbw-rgbcw-smart-light.html
type ILightProps = {
    /**
     * State of the light, should it be ON(true) or OFF(false).
     */
    state?: boolean;
    /** Strength of Red 0-255 */
    r?: IColorRange;
    /** Strength of Green 0-255 */
    g?: IColorRange;
    /** Strength of Blue 0-255 */
    b?: IColorRange;
    /** Strength of Cold White 0-255 */
    c?: IColorRange;
    /** Strength of Warm White 0-255 */
    w?: IColorRange;
    /** Strength of the light 0-100 */
    dimming?: IBrightnessRange;
}

interface IWizLight {
    /**
     * Turns the light on or off.
     * @param status Status of the light, should it be ON(true) or OFF(false).
     */
    setLightStatus(status: IStatus): Promise<IStatus>;
    /**
     * Sets the properties of the light, i.e. color, dimming, cold or warm
     * @param props properties of the light, i.e. color, dimming, cold or warm
     */
    setLightProps(props: ILightProps): Promise<IStatus>;
    /**
     * Returns the full status of the light, including if it is on/off, color, mc, rssi 
     */
    getStatus(): Promise<IFullStateResponse>;
    /**
     * Stops the Client.
     */
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
        sceneId: number;
        /**
         * State of the light, should it be ON(true) or OFF(false).
         */
        state: boolean;
        /** Strength of Red 0-255 */
        r: IColorRange;
        /** Strength of Green 0-255 */
        g: IColorRange;
        /** Strength of Blue 0-255 */
        b: IColorRange;
        /** Strength of Cold White 0-255 */
        c: IColorRange;
        /** Strength of Warm White 0-255 */
        w: IColorRange;
        /** Strength of the light 0-100 */
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