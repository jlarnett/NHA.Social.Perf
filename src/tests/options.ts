export const options = {
    scenarios: {
        anime_page_test: {
            executor: "ramping-vus",
            stages: [
                { duration: "30s", target: 10 },
                { duration: "1m", target: 50 },
                { duration: "30s", target: 0 },
            ],
            exec: "AnimePageTest",
        },

        search_api_test: {
            executor: "ramping-vus",
            stages: [
                { duration: "30s", target: 5 },
                { duration: "1m", target: 20 },
                { duration: "30s", target: 0 },
            ],
            exec: "SearchApiTest",
        },

        homepage_load_test: {
            executor: "ramping-vus",
            stages: [
                { duration: "30s", target: 5 },
                { duration: "1m", target: 10 },
                { duration: "30s", target: 0 },
            ],
            exec: "HomePageTest",
        },

        user_auth_test: {
            executor: "ramping-vus",
            stages: [
                { duration: "30s", target: 5 },
                { duration: "1m", target: 10 },
                { duration: "30s", target: 0 },
            ],
            exec: "userAuthTest",
        },
        create_post_test: {
            executor: "ramping-vus",
            stages: [
                { duration: "30s", target: 5 },
                { duration: "1m", target: 10 },
                { duration: "30s", target: 0 },
            ],
            exec: "createPostTest",
        },
        create_image_post_test: {
            executor: "ramping-vus",
            stages: [
                { duration: "30s", target: 5 },
                { duration: "1m", target: 10 },
                { duration: "30s", target: 0 },
            ],
            exec: "createImagePostTest",
        },
    },

    thresholds: {
        "http_req_duration{name:homepage}": ["p(95)<1500"],
        "http_req_duration{name:anime}": ["p(95)<500"],
        "http_req_duration{name:search}": ["p(95)<300"],
        "http_req_duration{name:user}": ["p(95)<1000"],
        "http_req_duration{name:basic-post}": ["p(95)<2000"],
        "http_req_duration{name:image-post}": ["p(95)<2000"],

        http_req_failed: ["rate<0.01"],
    },
};
