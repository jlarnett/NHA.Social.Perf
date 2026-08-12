import http from 'k6/http';

class BaseApi {
    apiUrl = `${__ENV.BASE_URL}/api/`;
    readonly cookieToken?: string;

    constructor(url = "", cookieToken?: string) {
        this.apiUrl = `${this.apiUrl}${url}`
        this.cookieToken = cookieToken;
    }

    get() {
        return http.get(this.apiUrl, {
            headers: this.cookieToken ? { 'Cookie': this.cookieToken } : undefined
        });
    }

    buildUrlParameters(parameterMap: Record<any, any>): string {
        if (!parameterMap || Object.keys(parameterMap).length === 0) {
            return '';
        }

        const queryString = Object.entries(parameterMap)
            .map(([key, value]) => `${key}=${value}`)
            .join('&');

        return `?${queryString}`;
    }
}

export default BaseApi;
