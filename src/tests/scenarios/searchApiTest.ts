import { check, sleep } from "k6";
import { faker } from "@faker-js/faker";
import SearchApi from "../../api/searchApi";
import type { SetupData } from "../types";

export function SearchApiTest(data: SetupData): void {
    const searchApi = new SearchApi(data.cookieToken);
    const result = searchApi.getSearch(faker.word.noun());

    check(result, {
        "Search API Successful": (r) => r.status === 200,
    });

    sleep(1);
}
