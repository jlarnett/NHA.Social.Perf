import BaseApi from "./api";
import http from "k6/http";

class AnimeApi extends BaseApi {
    constructor() {
        super('AnimePages');
    }

    getAnimePage(pageNumber: number) {
        const url = `${this.apiUrl}${this.buildUrlParameters({pageNumber: pageNumber})}`
        return http.get(url, {
            tags: {
                name: 'anime',
            }
        });
    }
}

export default AnimeApi;