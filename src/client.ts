// https://aleksandr.rogozin.us/blog/2021/8/13/hacking-philips-wiz-lights-via-command-line;

import { IWizLightOptions, IWizLight, ILightProps, IResponse, IFullStateResponse, IPAdd } from './client.interface';
import { UDPReqResClient } from "./udpReqResClient";

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