const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AnonymizeUAPlugin = require("puppeteer-extra-plugin-anonymize-ua");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");

const stealth = StealthPlugin()
stealth.enabledEvasions.delete('iframe.contentWindow')
stealth.enabledEvasions.delete('media.codecs')
puppeteer.use(stealth)
puppeteer.use(AnonymizeUAPlugin());
puppeteer.use(
    AdblockerPlugin({
        blockTrackers: true,
    })
);


async function givePermissions() {

    const url = new URL('https://meet.google.com');
    const browser = await puppeteer.launch({
        headless: false
    });

    const context = browser.defaultBrowserContext();
    context.clearPermissionOverrides();
    context.overridePermissions(url.origin, ['camera', 'microphone']);

    const page = await browser.newPage();

    return page;
}

async function openPage(page, meetingLink) {

    // Navigate to Google Meet login page
    await page.goto('https://'+meetingLink);

}

async function joinMeet(page){

    await new Promise(function (resolve) { setTimeout(resolve, 15000) });

    await page.waitForSelector('input[type="text"]');
    await page.type('input[type="text"]', "server");

    await new Promise(function (resolve) { setTimeout(resolve, 5000) });

    const link1 = await page.evaluateHandle(
        text => [...document.querySelectorAll('span')].find(span => span.textContent.includes(text)),
        "Ask to join"
    );

    console.log(link1);
    await link1.click();
}

async function endMeeting(page){

    await new Promise(function (resolve) { setTimeout(resolve, 5000) });

    await page.waitForSelector('button[aria-label="Leave call"]');
    await page.click('button[aria-label="Leave call"]');

}

module.exports = { givePermissions, openPage, joinMeet, endMeeting }