import { sleep } from 'k6';
import AnimeApi from "../api/animeApi";
import SearchApi from "../api/searchApi";
import { faker } from "@faker-js/faker";

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
    },

    thresholds: {
        http_req_duration: ['p(95)<300'],
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

