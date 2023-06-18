import puppeteer from 'puppeteer';

const indeed = async () => {
    const browser = await puppeteer.launch(`headless: true`);
    const page = await browser.newPage();

    await page.goto('https://www.indeed.com/jobs?q=software+engineer&l=United+States');
    


}

indeed();
