import puppeteer from "puppeteer";
import Levels from "../models/levelsModel.js";
import mongoose from "mongoose";


function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const levels = async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto("https://www.levels.fyi/internships/");

  await sleep(3000);

  const data = await page.evaluate(() => {
    const companies = Array.from(
      document.querySelectorAll(".company-name-th")
    ).map((company) => (company.innerText.split("\n")[0]));

    const locationTemp = Array.from(
      document.querySelectorAll(".company-name-th")
    ).map((company) => company.innerText.split("\n")[2]);

    const location = Array.from(locationTemp).map((loc) => {
        if (loc) {
            return loc.split("-")[0];
        }
        else {
            return loc;
        }
    });

    const term = Array.from(locationTemp).map((loc) => {
        if (loc) {
            return loc.split("-")[1];
        }
        else {
            return loc;
        }
    });



    const salariesHourlyTemp = Array.from(
      document.querySelectorAll(".salary-info")
    ).map((salary) => salary.innerText.split("\n")[0]);

    const salariesHourly = Array.from(salariesHourlyTemp).map((salary) => {
        if (salary) {
            return salary.replace(/[^0-9.]+/g, '', "");
        }
        else {
            return salary;
        }
    });



    const salariesMonthlyTemp = Array.from(
      document.querySelectorAll(".salary-info")
    ).map((salary) => salary.innerText.split("\n")[2]);

    const salariesMonthly = Array.from(salariesMonthlyTemp).map((salary) => {
        if (salary) {
            return salary.replace(/\D/g, "");
        }
        else {
            return salary;
        }
    });



    const additonal = Array.from(document.querySelectorAll(".tags-th")).map(
      (additional) => additional.innerText
    );
    const links = Array.from(document.querySelectorAll(".apply-th>p>a")).map(
      (link) => link.href
    );
    return {
      companies,
      location,
      term,
      salariesHourly,
      salariesMonthly,
      additonal,
      links,
    };
  });

  await mongoose
    .connect(process.env.MONGOURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected..."))
    .catch((err) => console.log(err));

  for (let i = 0; i < data.links.length; i++) {
    const level = new Levels({
      name: data.companies[i + 1],
      location: data.location[i + 1],
      terms: data.term[i + 1],
      salaryHourly: data.salariesHourly[i],
      salaryMonthly: data.salariesMonthly[i],
      additional: data.additonal[i + 1],
      link: data.links[i],
    });
    await level.save();
  }

  await browser.close();
  await mongoose.connection.close();

  console.log("Done!");
};