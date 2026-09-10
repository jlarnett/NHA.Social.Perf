import { check, sleep } from "k6";
import { faker } from "@faker-js/faker";
import SocialApi from "../../api/socialApi";
import { getRequestVerificationToken } from "../helpers/requestVerificationToken";
import type { SetupData } from "../types";

export function createPostTest(data: SetupData): void {
    const token = getRequestVerificationToken(data.cookieToken);
    const socialApi = new SocialApi(data.cookieToken);
    const date = new Date();
    const postResult = socialApi.createBasicPost(faker.lorem.paragraphs(10) + date.getTime(), token);

    check(postResult, {
        "Create Basic Post Successful": (r) => r.status === 201,
    });

    sleep(1);
}

export function createImagePostTest(data: SetupData): void {
    const token = getRequestVerificationToken(data.cookieToken);
    const socialApi = new SocialApi(data.cookieToken);
    const date = new Date();
    const postResult = socialApi.createImagePost(faker.lorem.paragraphs(10) + date.getTime(), token);

    check(postResult, {
        "Create Image Post Successful": (r) => r.status === 201,
    });

    sleep(1);
}