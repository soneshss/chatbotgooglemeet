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

async function openPage(page) {

    // Navigate to Google Meet login page
    await page.goto('https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fmeet.google.com&ifkv=AaSxoQwsD9iTbc9OnPBfs59zfy6btC1DYOiE9PiHKYxWZ1IQhyYmOYleZHJbS7uUt64Fpv-eiEw4dg&ltmpl=meet&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S1007368695%3A1715871759500213&ddm=0');

}

async function googleLogin(page) {

    // Type in email
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', "xxx@gmail.com");
    await page.keyboard.press('Enter');
    //await timeout(5000)'

    await new Promise(function (resolve) { setTimeout(resolve, 5000) });

    // Type in password
    await page.waitForSelector('input[type="password"]');
    await page.type('input[type="password"]', "xxx");
    await page.keyboard.press('Enter');

    await new Promise(function (resolve) { setTimeout(resolve, 5000) });


}

async function startMeeting(page) {

    // Type in password
    await page.waitForSelector('span[jsname="V67aGc"]');
    await page.click('span[jsname="V67aGc"]');

    await new Promise(function (resolve) { setTimeout(resolve, 5000) });

    const link1 = await page.evaluateHandle(
        text => [...document.querySelectorAll('span')].find(span => span.textContent.includes(text)),
        "Start an instant meeting"
    );

    console.log(link1);
    await link1.click();

}

async function getMeetingLink(page){

    await new Promise(function (resolve) { setTimeout(resolve, 30000) });

    const element = await page.waitForSelector('div[jsname="DkF5Cf"]');
    const meetingLink = await element.evaluate(el => el.textContent);
    console.log("meeting link: "+meetingLink)

    return meetingLink

}

async function muteMicrophone(page) {

    await new Promise(function (resolve) { setTimeout(resolve, 10000) });

    // Mute or unmute the mic
    await page.waitForSelector('[aria-label="Turn off microphone (⌘ + d)"]');
    await page.click('[aria-label="Turn off microphone (⌘ + d)"]');

}

async function unmuteMicrophone(page) {

    await new Promise(function (resolve) { setTimeout(resolve, 15000) });

    // Mute or unmute the mic
    await page.click('[aria-label="Turn on microphone (⌘ + d)"]');
}

async function changeLayout(page) {

    await new Promise(function (resolve) { setTimeout(resolve, 15000) });

    await page.waitForSelector('button[jsname="NakZHc"]');
    await page.click('button[jsname="NakZHc"]');

    await new Promise(function (resolve) { setTimeout(resolve, 5000) });

    await page.waitForSelector('li[jsname="WZerud"]');
    await page.click('li[jsname="WZerud"]');

    await new Promise(function (resolve) { setTimeout(resolve, 5000) });

    await page.waitForSelector('input[id="ucc-9"]');
    await page.click('input[id="ucc-9"]');

    await new Promise(function (resolve) { setTimeout(resolve, 5000) });

    await page.waitForSelector('button[aria-label="Close"]');
    await page.click('button[aria-label="Close"]');

}

async function allowParticipant(page){

    await new Promise(function (resolve) { setTimeout(resolve, 5000) });

    const link1 = await page.evaluateHandle(
        text => [...document.querySelectorAll('span')].find(span => span.textContent.includes(text)),
        "Admit"
    );

    console.log(link1);
    await link1.click();

}

async function sendMessage(page){

    await new Promise(function (resolve) { setTimeout(resolve, 5000) });

    await page.waitForSelector('button[aria-label="Chat with everyone"]');
    await page.click('button[aria-label="Chat with everyone"]');

    await new Promise(function (resolve) { setTimeout(resolve, 5000) });

    await page.waitForSelector('textarea[id="bfTqV"]');
    await page.type('textarea[id="bfTqV"]', "Hello server");
    await page.keyboard.press('Enter');

    await new Promise(function (resolve) { setTimeout(resolve, 5000) });

}

async function endMeeting(page){

    await new Promise(function (resolve) { setTimeout(resolve, 5000) });

    await page.waitForSelector('button[aria-label="Leave call"]');
    await page.click('button[aria-label="Leave call"]');

}


module.exports = { givePermissions, openPage, googleLogin, startMeeting, getMeetingLink, muteMicrophone, unmuteMicrophone, changeLayout, allowParticipant, sendMessage, endMeeting }
