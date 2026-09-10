import { check, sleep } from "k6";
import UserApi from "../../api/userApi";
import { testConfig } from "../config";
import type { SetupData } from "../types";

export function userAuthTest(data: SetupData): void {
    const userApi = new UserApi(data.cookieToken);
    const result = userApi.authenticate(testConfig.testUserEmail, testConfig.testUserPassword, "true");

    check(result, {
        "User Auth Successful": (r) => r.status === 200,
    });

    sleep(1);
}
