import http from 'k6/http';

class BaseApi {
    apiUrl = 'https://localhost:44385/api/';
    //apiUrl = 'https://nhaindustries.azurewebsites.net/api/';

    constructor(url = "") {
        this.apiUrl = `${this.apiUrl}${url}`
    }

    get() {
        return http.get(this.apiUrl);
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
