import BaseApi from "./api";
import http from "k6/http";

class socialApi extends BaseApi {
    constructor() {
        super('posts');
    }

    createBasicPost(summary: string, requestVerificationToken: string) {
        const payload = {
            Summary: summary,
            __RequestVerificationToken: requestVerificationToken
        };

        return http.post(`${this.apiUrl}/basicPost`, payload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            tags: {
                name: 'basic-post',
            }

        });
    }
}

export default socialApi;