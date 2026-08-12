import BaseApi from "./api";
import http from "k6/http";

class SearchApi extends BaseApi {
    constructor(cookieToken: string) {
        super('Search', cookieToken);
    }

    getSearch(searchString: string) {
        return http.get(`${this.apiUrl}/${searchString}`,
            {
                tags: {
                    name: 'search',
                }
            })
    }
}

export default SearchApi;