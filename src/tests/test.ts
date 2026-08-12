import { check, sleep } from 'k6';
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
    cookieToken: string;
};

/**
 * Does 1 time login before tests.
 */
export function setup(): SetupData {

    console.log('Running setup...');
    const userApi = new UserApi('');
    const result = userApi.authenticate(testConfig.testUserEmail, testConfig.testUserPassword, "true");

    check(result, {
        'User Auth Successful': (r) => r.status === 200,
    });

    const parsedBody = JSON.parse(result.body as string);
    const userId = parsedBody != null ? parsedBody.userId : '';
    const email = parsedBody != null ? parsedBody.email : '';
    const cookieToken = Object.entries(result.cookies)
        .map(([name, cookies]) => {
            return `${name}=${cookies[0].value}`;
        })
        .join('; ');

    return {
        userId: userId,
        userEmail: email,
        cookieToken: cookieToken,
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
        },
        create_image_post_test: {
            executor: 'ramping-vus',
            stages: [
                { duration: '30s', target: 5 },
                { duration: '1m', target: 10 },
                { duration: '30s', target: 0 },
            ],
            exec: 'createImagePostTest',
        },
    },

    thresholds: {
        'http_req_duration{name:homepage}': ['p(95)<1500'],
        'http_req_duration{name:anime}': ['p(95)<500'],
        'http_req_duration{name:search}': ['p(95)<300'],
        'http_req_duration{name:user}': ['p(95)<1000'],
        'http_req_duration{name:basic-post}': ['p(95)<2000'],
        'http_req_duration{name:image-post}': ['p(95)<2000'],

        http_req_failed: ['rate<0.01'],
    },
};

export function AnimePageTest(data: SetupData): void {
    const animeApi = new AnimeApi(data.cookieToken);
    const randomPageNumber = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    const result = animeApi.getAnimePage(randomPageNumber);
    check(result, {
        'Anime API Successful': (r) => r.status === 200,
    });
    sleep(1);
}

export function SearchApiTest(data: SetupData): void {
    const searchApi = new SearchApi(data.cookieToken);
    const result = searchApi.getSearch(faker.word.noun());
    check(result, {
        'Search API Successful': (r) => r.status === 200,
    });
    sleep(1);
}

export function HomePageTest(data: SetupData): void {
    const homePage = new HomePage(data.cookieToken);
    const result = homePage.get();
    check(result, {
        'Home Page Load Successful': (r) => r.status === 200,
    });
    sleep(1);
}

export function userAuthTest(data: SetupData): void {
    const userApi = new UserApi(data.cookieToken);
    const result = userApi.authenticate(testConfig.testUserEmail, testConfig.testUserPassword, "true");
    check(result, {
        'User Auth Successful': (r) => r.status === 200,
    });
    sleep(1);
}

export function createPostTest(data: SetupData) : void {
    const homePage = new HomePage(data.cookieToken);
    const homeResult = homePage.get();

    const html = homeResult.body as string;
    const doc = parseHTML(html);

    const token = doc
        .find('input[name="__RequestVerificationToken"]')
        .attr('value');

    check(token, {
        'Anti-Forgery Token successfully located': (t) => t !== undefined,
    });

    if(!token) {
        throw new Error('Anti-Forgery Token not found on the page.');
    }

    const socialApi = new SocialApi(data.cookieToken);

    const date = new Date();
    const postResult = socialApi.createBasicPost(faker.lorem.paragraphs(10) + date.getTime(), token);

    check(postResult, {
        'Create Basic Post Successful': (r) => r.status === 201,
    });
    sleep(1);
}

export function createImagePostTest(data: SetupData) : void {
    const homePage = new HomePage(data.cookieToken);
    const homeResult = homePage.get();

    const html = homeResult.body as string;
    const doc = parseHTML(html);

    const token = doc
        .find('input[name="__RequestVerificationToken"]')
        .attr('value');

    const success = check(token, {
        'Anti-Forgery Token successfully located': (t) => t !== undefined,
    });

    if(!token) {
        throw new Error('Anti-Forgery Token not found on the page.');
    }

    if(success) {
        const socialApi = new SocialApi(data.cookieToken);

        const date = new Date();
        const postResult = socialApi.createImagePost(faker.lorem.paragraphs(10) + date.getTime(), token);
        check(postResult, {
            'Create Image Post Successful': (r) => r.status === 201,
        });
    }

    sleep(1);
}