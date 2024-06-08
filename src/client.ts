import { IWizLightOptions, IWizLight, ILightProps, IResponse, IFullStateResponse, IPAdd } from './client.interface';
import { UDPReqResClient } from "./udpReqResClient";


/**
 * WizLight Client
 * 
 * 
 * Quick tutorial to get a green light on wiz based bulb:
 * ```JS
 * const wl = new WizLight('192.168.1.2'); // IP address of your light (check from router)
 * const data = await wl.setLightProps({
        r: 0,
        g: 255,
        b: 0,
        dimming: 100
 *  });
 * ```
 * 
 * Supports options configuration:
 * 
 * ```JS
 * const wl = new WizLight('192.168.1.2', { // IP address of your light (check from router)
    // Port number; 
    // Default is 38899
    port: 38899,
    
    // As all the communication happens over UDP, there is no direct response to the request.
    // We have to wait for some time to receive a message from the device to know if the request was served or not, post 
    // that time the request is considered as failed and retry mechanism kicks in.

    // This represents the time that we should wait before retrying.
    // Default is 1000ms
    statusCheckTimeout: 1000,

    // Number of times we should retry a request in case of a failure.
    // Default is 5
    retryTimes: 5,
 * }); 
 * 
 * ```
 * 
 * This lib would not have been possible without the help that I received from this article: https://aleksandr.rogozin.us/blog/2021/8/13/hacking-philips-wiz-lights-via-command-line
 * 
 */
class WizLight<S extends string> implements IWizLight {

    private  state: ILightProps = {
        r: 255,
        g: 255,
        b: 255,
        c: 255,
        w: 255,
        dimming: 100
    }
    private udp: UDPReqResClient;
    /**
     * Creates a new instance of WizLight client.
     * @param ip IP address to connect to as a string.
     * @param options optional options to configer the client.
     */
    constructor(ip: IPAdd<S>, options?: IWizLightOptions) {
        const mergedOptions = {
            ip,
            port: 38899,
            retryTimes: 5,
            statusCheckTimeout: 1000,
            ...options,
        };
        this.udp = new UDPReqResClient(
            mergedOptions.ip,
            mergedOptions.port,
            mergedOptions.statusCheckTimeout,
            mergedOptions.retryTimes,
        );
        
    }

    private getGetRequestWrapper(params: Record<string, unknown>) {
        return {
            method: 'getPilot',
            params
        }
    }

    private getSetRequestWrapper(params: Record<string, unknown>) {
        return {
            method: 'setPilot',
            params
        }
    }

    async setLightStatus(status: Boolean): Promise<Boolean> {
        const data = await this.udp.request<IResponse>(this.getSetRequestWrapper({
            state: status
        }));
        if(data.error) {
            return Promise.reject(data.error);
        }
        return data.result.success;
    }

    async setLightProps(props: ILightProps): Promise<Boolean> {
        // update state;
        this.state = {
            ...this.state,
            ...props
        };
        const data = await this.udp.request<IResponse>(this.getSetRequestWrapper({...this.state}));
        if(data.error) {
            return Promise.reject(data.error);
        }
        return data.result.success;
    }

    async getStatus(): Promise<IFullStateResponse> {
        const data = await this.udp.request<IFullStateResponse>(this.getGetRequestWrapper({}));
        return data;
    }

    destroy(): void {
        this.udp.close();
    }
}


export {
    WizLight
}

