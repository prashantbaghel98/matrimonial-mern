const Profile = require("../models/profileModel");

const siteMap = async (req, res) => {
  try {
    const profiles = await Profile.find();

    let urls = `
      <url>
        <loc>https://apnavivah.in/</loc>
      </url>
      <url>
        <loc>https://apnavivah.in/browse-profile</loc>
      </url>
       <url>
        <loc>https://apnavivah.in/about</loc>
      </url>
       <url>
        <loc>https://apnavivah.in/membership</loc>
      </url>
        <url>
        <loc>https://apnavivah.in/success-stories</loc>
      </url>
        <url>
        <loc>https://apnavivah.in/contact</loc>
      </url>
    `;

    profiles.forEach((p) => {
      urls += `
        <url>
          <loc>https://apnavivah.in/browse-profile/${p._id}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
        </url>
      `;
    });

    res.header("Content-Type", "application/xml");

    res.send(`<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls}
      </urlset>
    `);

  } catch (error) {
    console.error("Sitemap Error:", error);
    res.status(500).send(error.message);
  }
};

module.exports = { siteMap };