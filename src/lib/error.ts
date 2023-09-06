export class ServerTimeoutError extends Error {
    constructor (message = 'Server timeout error') {
        super(message)
        this.name = 'ServerTimeoutError'

    }
}


export const ServerTimeout = async (miliseconds = 9_000) => new Promise((resolve, reject) => setTimeout(() => reject(new ServerTimeoutError("Server Timeout")), miliseconds))
