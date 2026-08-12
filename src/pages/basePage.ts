import http from 'k6/http';

class BasePage {
    baseUrl = `${__ENV.BASE_URL}/`;
    readonly cookieToken?: string;

    constructor(page = "", cookieToken?: string) {
        this.baseUrl = `${this.baseUrl}${page}`;
        this.cookieToken = cookieToken;
    }

    get() {
        return http.get(this.baseUrl, {
            headers: this.cookieToken ? { 'Cookie': this.cookieToken } : undefined
        });
    }
}

export default BasePage;
