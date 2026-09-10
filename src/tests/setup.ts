import { check } from "k6";
import UserApi from "../api/userApi";
import { testConfig } from "./config";
import type { SetupData } from "./types";

/**
 * Does 1 time login before tests.
 */
export function setup(): SetupData {
    console.log("Running setup...");
    const userApi = new UserApi("");
    const result = userApi.authenticate(testConfig.testUserEmail, testConfig.testUserPassword, "true");

    check(result, {
        "User Auth Successful": (r) => r.status === 200,
    });

    const parsedBody = JSON.parse(result.body as string);
    const userId = parsedBody != null ? parsedBody.userId : "";
    const email = parsedBody != null ? parsedBody.email : "";
    const cookieToken = Object.entries(result.cookies)
        .map(([name, cookies]) => {
            return `${name}=${cookies[0].value}`;
        })
        .join("; ");

    return {
        userId: userId,
        userEmail: email,
        cookieToken: cookieToken,
    };
}
