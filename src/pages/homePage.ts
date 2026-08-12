import BasePage from "./basePage";
import http from "k6/http";

class HomePage extends BasePage {

    constructor(cookieToken: string) {
        super('', cookieToken);
    }

    override get() {
        return http.get(this.baseUrl, {
            headers: this.cookieToken ? { 'Cookie': this.cookieToken } : undefined,
            tags: {
                name: 'homepage',
            }
        });
    }
}

export default HomePage;