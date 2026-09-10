import { check } from "k6";
import UserApi from "../api/userApi";
import { testConfig } from "./config";
import type { SetupData } from "./types";
import { fakerEN } from "@faker-js/faker";

/**
 * Does 1 time login before tests.
 */
export function setup(): SetupData {
    console.log("Running setup...");
    const userApi = new UserApi("");
    const testUserEmail = fakerEN.internet.email();
    const displayName = fakerEN.internet.displayName();
    const createUserResult = userApi.createUser(testUserEmail, testConfig.testUserPassword, testConfig.testUserPassword, displayName);

    check(createUserResult, {
        "User Creation Successful": (r) => r.status === 201,
    });

    const result = userApi.authenticate(testUserEmail, testConfig.testUserPassword, "true");

    check(result, {
        "User Auth Successful": (r) => r.status === 200,
    });

    const parsedBody = JSON.parse(result.body as string);
    const userId = parsedBody != null ? parsedBody.userId : "";
    const cookieToken = Object.entries(result.cookies)
        .map(([name, cookies]) => {
            return `${name}=${cookies[0].value}`;
        })
        .join("; ");

    return {
        userId: userId,
        userEmail: testUserEmail,
        cookieToken: cookieToken,
    };
}
