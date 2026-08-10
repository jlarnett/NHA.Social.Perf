import BasePage from "./basePage";
import http from "k6/http";

class HomePage extends BasePage {
    constructor() {
        super('');
    }

    override get() {
        return http.get(this.baseUrl, {
            tags: {
                name: 'homepage',
            }
        });
    }
}

export default HomePage;