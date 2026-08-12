import BaseApi from "./api";
import http from "k6/http";

const imageUploadBytes =
    open("..\\src\\support\\test-files\\test-png.png", "b");

class socialApi extends BaseApi {

    constructor(cookieToken: string) {
        super('posts', cookieToken);
    }

    createBasicPost(summary: string, requestVerificationToken: string) {
        const payload = {
            Summary: summary,
            __RequestVerificationToken: requestVerificationToken
        };

        return http.post(`${this.apiUrl}/basicPost`, payload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': this.cookieToken ? this.cookieToken : '',
            },
            tags: {
                name: 'basic-post',
            }

        });
    }

    createImagePost(summary: string, requestVerificationToken: string) {
        const payload = {
            Summary: summary,
            ImageFiles: http.file(imageUploadBytes, "test-png.png",
                "image/png"),
            __RequestVerificationToken: requestVerificationToken
        };

        return http.post(`${this.apiUrl}/CustomizedPost`, payload, {
            headers: {
                'Cookie': this.cookieToken ? this.cookieToken : '',
            },
            tags: {
                name: 'image-post',
            }

        });
    }
}

export default socialApi;