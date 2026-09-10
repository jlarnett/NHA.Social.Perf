import BaseApi from "./api";
import http from "k6/http";

class UserApi extends BaseApi {
    constructor(cookieToken: string) {
        super('Users', cookieToken);
    }

    authenticate(user: string, password: string, remember: string) {

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

    createUser(email: string,  password: string, confirmPassword: string, displayName?: string) {
        return http.post(`${this.apiUrl}/register`,
            {
                email: email,
                password: password,
                confirmPassword: confirmPassword,
                displayName: displayName ?? '',
            },
            {
                tags: {
                    name: 'user',
                }
            });
    }


}

export default UserApi;