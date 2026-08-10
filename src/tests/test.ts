import { sleep } from 'k6';
import AnimeApi from "../api/animeApi";
import SearchApi from "../api/searchApi";
import { faker } from "@faker-js/faker";
import HomePage from "../pages/homePage";
import UserApi from "../api/userApi";
import SocialApi from "../api/socialApi";
import { parseHTML } from "k6/html";

const testConfig = {
    baseUrl: __ENV.BASE_URL,
    testUserEmail: __ENV.TEST_USER_EMAIL,
    testUserPassword: __ENV.TEST_USER_PASSWORD,
}

type SetupData = {
    userId: string;
    userEmail: string;
};

/**
 * Does 1 time login before tests.
 */
export function setup(): SetupData {
    const userApi = new UserApi();
    const result = userApi.authenticate(testConfig.testUserEmail, testConfig.testUserPassword, "true");
    if (result.status !== 200) {
        console.log(`User Auth Setup Failed: ${result.status} ${result.body}`);
    }

    console.log('Running setup...');
    const parsedBody = JSON.parse(result.body as string);
    const userId = parsedBody != null ? parsedBody.userId : '';
    const email = parsedBody != null ? parsedBody.email : '';

    return {
        userId: userId,
        userEmail: email,
    };
}

export const options = {
    scenarios: {
        anime_page_test: {
            executor: 'ramping-vus',
            stages: [
                { duration: '30s', target: 10 },
                { duration: '1m', target: 50 },
                { duration: '30s', target: 0 },
            ],
            exec: 'AnimePageTest',
        },

        search_api_test: {
            executor: 'ramping-vus',
            stages: [
                { duration: '30s', target: 5 },
                { duration: '1m', target: 20 },
                { duration: '30s', target: 0 },
            ],
            exec: 'SearchApiTest',
        },

        homepage_load_test: {
            executor: 'ramping-vus',
            stages: [
                { duration: '30s', target: 5 },
                { duration: '1m', target: 10 },
                { duration: '30s', target: 0 },
            ],
            exec: 'HomePageTest',
        },

        user_auth_test: {
            executor: 'ramping-vus',
            stages: [
                { duration: '30s', target: 5 },
                { duration: '1m', target: 10 },
                { duration: '30s', target: 0 },
            ],
            exec: 'userAuthTest',
        },
        create_post_test: {
            executor: 'ramping-vus',
            stages: [
                { duration: '30s', target: 5 },
                { duration: '1m', target: 10 },
                { duration: '30s', target: 0 },
            ],
            exec: 'createPostTest',
        }
    },

    thresholds: {
        'http_req_duration{name:homepage}': ['p(95)<1500'],
        'http_req_duration{name:anime}': ['p(95)<500'],
        'http_req_duration{name:search}': ['p(95)<300'],
        'http_req_duration{name:user}': ['p(95)<300'],
        'http_req_duration{name:basic-post}': ['p(95)<2000'],

        http_req_failed: ['rate<0.01'],
    },
};

export function AnimePageTest(): void {
    const animeApi = new AnimeApi();
    const randomPageNumber = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    const result = animeApi.getAnimePage(randomPageNumber);
    if (result.status !== 200) {
        console.log(`Anime API failed: ${result.status} ${result.body}`);
    }
    sleep(1);
}

export function SearchApiTest(): void {
    const searchApi = new SearchApi();
    const result = searchApi.getSearch(faker.word.noun());
    if (result.status !== 200) {
        console.log(`Search API failed: ${result.status} ${result.body}`);
    }
    sleep(1);
}

export function HomePageTest(): void {
    const homePage = new HomePage();
    const result = homePage.get();
    if (result.status !== 200) {
        console.log(`Home Page Load Failed: ${result.status} ${result.body}`);
    }
    sleep(1);
}

export function userAuthTest(): void {
    const userApi = new UserApi();
    const result = userApi.authenticate(testConfig.testUserEmail, testConfig.testUserPassword, "true");
    if (result.status !== 200) {
        console.log(`User Auth Failed: ${result.status} ${result.body}`);
    }
    sleep(1);
}

export function createPostTest() : void {
    const userApi = new UserApi();
    const result = userApi.authenticate(testConfig.testUserEmail, testConfig.testUserPassword, "true");
    if (result.status !== 200) {
        console.log(`User Auth Failed: ${result.status} ${result.body}`);
    }

    const homePage = new HomePage();
    const homeResult = homePage.get();

    const html = homeResult.body as string;
    const doc = parseHTML(html);

    const token = doc
        .find('input[name="__RequestVerificationToken"]')
        .attr('value');

    if(!token) {
        throw new Error('Anti-Forgery token was not found');
    }

    const socialApi = new SocialApi();
    const postResult = socialApi.createBasicPost(faker.lorem.paragraphs(10), token);
    if (postResult.status !== 201) {
        console.log(`Create Post Failed: ${postResult.status}`);
    }
    sleep(1);

}