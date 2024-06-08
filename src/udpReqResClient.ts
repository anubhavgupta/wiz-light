import { createSocket, Socket } from 'node:dgram';

/**
 * UDP client used for communication with the device.
 */
class UDPReqResClient {
    private client: Socket;
    private ip: string;
    private port: number;
    private requestTimeout: number;
    private retryCount: number;
    private counter: number;

    constructor(ip: string, port: number, requestTimeout: number, retryCount: number) {
        this.client = createSocket('udp4');
        this.ip = ip;
        this.port = port;
        this.requestTimeout = requestTimeout ?? 1000;
        this.retryCount = retryCount ? retryCount - 1 : 4;
        this.counter = 0;
    }

    request<T>(data: Record<string, unknown>): Promise<T> {
        this.counter = (this.counter % 1000) + 1;
        const dataWithId = {
            id: this.counter,
            ...data
        }
        const dataToBeSend  = Buffer.from(JSON.stringify(dataWithId));
        
        return this.withRetry<T>(() => this.basicRequest(dataToBeSend, this.counter), this.retryCount);
    }

    close() {
        this.client.close();
    }

    private async withRetry<T>(req: () => Promise<T>, count = 0, err?: string): Promise<T> {
        if(count >= 0) {
            try {
                const data = await req();
                return data;
            } catch(ex) {
                console.log('Error', ex);
                return this.withRetry(req, count - 1, ex as string);
            }
        } else {
            return Promise.reject(err);
        }
    }

    private basicRequest<T>(data: Buffer, reqId: number) {
        
        return new Promise<T>((res, rej)=>{

            const timeoutId = setTimeout(() => onFailure('TIMEOUT'), this.requestTimeout);

            const cleanup = () => {
                clearTimeout(timeoutId);
                this.client.off('message', onMessage);
            }

            const onMessage = (message: string) => {
                const data = JSON.parse(message);
                if(data.id === reqId) {
                    res(data as T);
                    cleanup();
                }
            }

            const onFailure = (reason: string)=>{
                rej(reason);
                cleanup();
            }

            this.client.on('message', onMessage);
            
            this.client.send(data, this.port, this.ip, (err)=>{
                if (err) {
                    rej('ERROR');
                    console.error('Failed to send packet !!', err);
                }
                console.log('sent!!');
                //cleanup();
            });
            
        });
        
    }
}

export {
    UDPReqResClient
};