import http from 'k6/http';

class BasePage {
    baseUrl = 'https://localhost:44385/';
    //baseUrl = 'https://nhaindustries.azurewebsites.net/';

    constructor(page = "") {
        this.baseUrl = `${this.baseUrl}${page}`
    }

    get() {
        return http.get(this.baseUrl);
    }
}

export default BasePage;
