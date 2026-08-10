import BaseApi from "./api";
import http from "k6/http";

class UserApi extends BaseApi {
    constructor() {
        super('Users');
    }

    authenticate(user: string, password: string, remember: string) {

        console.log(`${this.apiUrl}/authenticate`)

        return http.post(`${this.apiUrl}/authenticate`,
            {
                userNameOrEmail: user,
                password: password,
                rememberMe: remember
            },
            {
                tags: {
                    name: 'user',
                }
            });
    }
}

export default UserApi;