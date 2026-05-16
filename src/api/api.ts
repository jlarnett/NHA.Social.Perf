import http from 'k6/http';

class BaseApi {
    apiUrl = 'https://localhost:44385/api/';

    constructor(url = "") {
        this.apiUrl = `${this.apiUrl}${url}`
    }

    get() {
        return http.get(this.apiUrl);
    }

    buildParameterUrl(parameterMap: Record<any, any>): string {
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