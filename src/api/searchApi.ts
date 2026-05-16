import BaseApi from "./api";
import http from "k6/http";

class SearchApi extends BaseApi {
    constructor() {
        super('Search');
    }

    getSearch(searchString: string) {
        return http.get(`${this.apiUrl}/${searchString}`)
    }
}

export default SearchApi;