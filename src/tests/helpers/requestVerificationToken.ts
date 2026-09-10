import { check } from "k6";
import { parseHTML } from "k6/html";
import HomePage from "../../pages/homePage";

/**
 * Gets the request verification token from the home page forms
 * @param cookieToken - authentication cookie
 */
export function getRequestVerificationToken(cookieToken: string): string {
    const homePage = new HomePage(cookieToken);
    const homeResult = homePage.get();
    const html = homeResult.body as string;
    const doc = parseHTML(html);
    const token = doc
        .find("input[name=\"__RequestVerificationToken\"]")
        .attr("value");

    check(token, {
        "Anti-Forgery Token successfully located": (t) => t !== undefined,
    });

    if (!token) {
        throw new Error("Anti-Forgery Token not found on the page.");
    }

    return token;
}
