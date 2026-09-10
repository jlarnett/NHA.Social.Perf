import { check, sleep } from "k6";
import AnimeApi from "../../api/animeApi";
import type { SetupData } from "../types";

export function AnimePageTest(data: SetupData): void {
    const animeApi = new AnimeApi(data.cookieToken);
    const randomPageNumber = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
    const result = animeApi.getAnimePage(randomPageNumber);

    check(result, {
        "Anime API Successful": (r) => r.status === 200,
    });

    sleep(1);
}
