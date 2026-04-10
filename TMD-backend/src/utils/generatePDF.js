const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const generateDiplomaPDF = async (studentData) => {
  const templatePath = path.join(__dirname, "../templates/certificate.html");
  let html = fs.readFileSync(templatePath, "utf8");

  html = html.replace("{{fullName}}", studentData.fullName);
  html = html.replace("{{specialty}}", studentData.specialty);
  html = html.replace("{{faculty}}", studentData.faculty);
  html = html.replace("{{sectionNum}}", studentData.sectionNum);
  html = html.replace("{{facultyNum}}", studentData.facultyNum);
  html = html.replace("{{mention}}", studentData.mention);
  html = html.replace(/{{graduationDate}}/g, studentData.graduationDate);
  html = html.replace("{{issueDate}}", studentData.issueDate);
  html = html.replace("{{uniqueCode}}", studentData.uniqueCode);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const fileName = `diploma_${studentData.uniqueCode}.pdf`;
  const filePath = path.join(__dirname, "../../uploads", fileName);

  await page.pdf({
    path: filePath,
    width: "1050px",
    height: "742px",
    printBackground: true,
  });

  await browser.close();
  return `uploads/${fileName}`;
};

module.exports = generateDiplomaPDF;
