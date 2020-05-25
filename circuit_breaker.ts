import { Validator } from './interfaces/validator.ts'

export enum State {
    Opened = 'opened',
    Closed = 'closed',
    //HalfOpen = 'half-open'
}

export class CircuitBreaker {
    private validator: Validator;
    private state: State = State.Opened;

    constructor(validator: Validator) {
        this.validator = validator;
    }

    public isOpened(): boolean {
        return this.state === State.Opened;
    }

    public open() {
        this.state = State.Opened;
    }

    public close() {
        this.state = State.Closed;
    }

    public async fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
        if (this.isOpened()) {
            const promise: Promise<Response> = fetch(input, init);
            await promise.then(response => {
                if (response.status === 500) {
                    const block = this.validator.handleError()
                    if (block) {
                        this.close();
                    }
                }
            }).catch(error => {
                const block = this.validator.handleError()
                if (block) {
                    this.close();
                }
                throw error;
            });
            return promise;
        } else {
            throw TypeError(`Circuit breaker is "${this.state}"`);
        }
    }

}