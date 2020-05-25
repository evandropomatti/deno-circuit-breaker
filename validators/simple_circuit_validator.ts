import { Validator } from '../interfaces/validator.ts'

export class SimpleValidator implements Validator {

    private maximumFails: number;
    private currentFails: number = 0;
    private closeTimeout: number;
    // private releaseTime: number = 0;
    // private errorCooldown: number;

    constructor({ maximumFails = 3,
        closeTimeout = 30000,
        // errorCooldown = 5000
    }: { maximumFails?: number, closeTimeout?: number, /** errorCooldown?: number */ } = {}) {
        this.maximumFails = maximumFails;
        this.closeTimeout = closeTimeout;
        // this.errorCooldown = errorCooldown;
    }

    handleError(): boolean {
        this.currentFails++;
        if (this.currentFails >= this.maximumFails) {
            setTimeout(() => { this.currentFails = 0; }, this.closeTimeout);
            //this.releaseTime = Date.now() + this.closeTimeout;
            return true;
        }
        return false;
    }

}