import got from "got/dist/source"
import { UserAgent } from "../typings/Headers"

export  const requestAmikomOne = got.extend({
    headers: {
        'user-agent': UserAgent
    },
    timeout: {
        request: 9
    }
})

