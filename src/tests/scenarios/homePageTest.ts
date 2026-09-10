import { check, sleep } from "k6";
import HomePage from "../../pages/homePage";
import type { SetupData } from "../types";

export function HomePageTest(data: SetupData): void {
    const homePage = new HomePage(data.cookieToken);
    const result = homePage.get();

    check(result, {
        "Home Page Load Successful": (r) => r.status === 200,
    });

    sleep(1);
}
