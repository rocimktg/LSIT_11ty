const https = require("https");

const SHEET_ID =
  process.env.ANNOUNCEMENTS_SHEET_ID ||
  "11NjRAhcDLYHsUzBEY81j4RvaUO5oX-YPnybD9FUnshY";
const SHEET_NAME = process.env.ANNOUNCEMENTS_SHEET_NAME || "";
const SHEET_GID = process.env.ANNOUNCEMENTS_SHEET_GID || "0";
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv${
  SHEET_NAME
    ? `&sheet=${encodeURIComponent(SHEET_NAME)}`
    : `&gid=${encodeURIComponent(SHEET_GID)}`
}`;

const fetchText = (url, redirects = 0) =>
  new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (
          res.statusCode &&
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location &&
          redirects < 5
        ) {
          res.resume();
          resolve(fetchText(res.headers.location, redirects + 1));
          return;
        }

        if (res.statusCode && res.statusCode >= 400) {
          res.resume();
          reject(new Error(`Request failed with status ${res.statusCode}`));
          return;
        }

        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => resolve(data));
      })
      .on("error", reject);
  });

const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && text[i + 1] === "\n") {
        i += 1;
      }
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows;
};

const normalizeCell = (value) => (value || "").toString().trim();
const parseSticky = (value) => /^(yes|y|true|1)$/i.test(normalizeCell(value));

const buildAnnouncements = (rows) => {
  const cleanedRows = rows
    .map((row) => row.map(normalizeCell))
    .filter((row) => row.some((cell) => cell));

  if (!cleanedRows.length) {
    return { items: [], sticky: [], regular: [] };
  }

  const header = cleanedRows[0].map((cell) => cell.toLowerCase());
  const hasHeader = header.some((cell) =>
    ["date", "title", "body", "location", "time", "sticky", "link", "url"].some((key) =>
      cell.includes(key)
    )
  );

  let dataRows = cleanedRows;
  let indices = {
    sticky: 0,
    date: 1,
    time: 2,
    location: 3,
    title: 4,
    linkTitle: 5,
    linkUrl: 6,
    body: 7,
  };

  if (hasHeader) {
    const findIndex = (keywords, fallback) => {
      const index = header.findIndex((cell) =>
        keywords.some((keyword) => cell.includes(keyword))
      );
      return index === -1 ? fallback : index;
    };
    const findIndexBy = (predicate, fallback) => {
      const index = header.findIndex(predicate);
      return index === -1 ? fallback : index;
    };

    const linkTitleIndex = findIndexBy(
      (cell) =>
        cell.includes("link title") || cell.includes("link text") || cell === "cta",
      -1
    );
    const linkUrlIndex = findIndexBy(
      (cell) =>
        cell === "link" ||
        cell === "url" ||
        cell.includes("link url") ||
        cell.includes("link href") ||
        cell.includes("link address"),
      -1
    );

    indices = {
      sticky: findIndex(["sticky", "pin", "featured"], indices.sticky),
      date: findIndex(["date", "post date", "when"], indices.date),
      time: findIndex(["time"], indices.time),
      location: findIndex(["location", "where", "place"], indices.location),
      title: findIndex(["title", "post title"], indices.title),
      linkTitle: linkTitleIndex,
      linkUrl: linkUrlIndex,
      body: findIndex(["body", "post body", "announcement", "message"], indices.body),
    };
    dataRows = cleanedRows.slice(1);
  } else {
    const maxColumns = Math.max(...cleanedRows.map((row) => row.length));
    if (maxColumns <= 3) {
      indices = {
        title: 1,
        date: 0,
        location: -1,
        time: -1,
        body: 2,
        linkTitle: -1,
        linkUrl: -1,
        sticky: -1,
      };
    }
  }

  const getValue = (row, index) =>
    index >= 0 && index < row.length ? row[index] : "";

  const items = dataRows
    .map((row) => {
      const title = getValue(row, indices.title);
      const date = getValue(row, indices.date);
      const location = getValue(row, indices.location);
      const time = getValue(row, indices.time);
      const body = getValue(row, indices.body);
      const linkTitle = getValue(row, indices.linkTitle);
      const linkUrl = getValue(row, indices.linkUrl);
      const stickyRaw = getValue(row, indices.sticky);

      return {
        title,
        date,
        location,
        time,
        body,
        linkTitle,
        linkUrl,
        sticky: parseSticky(stickyRaw),
      };
    })
    .filter((item) =>
      item.title ||
      item.body ||
      item.date ||
      item.location ||
      item.time ||
      item.linkTitle ||
      item.linkUrl
    );

  const sticky = items.filter((item) => item.sticky);
  const regular = items.filter((item) => !item.sticky);

  return { items, sticky, regular };
};

module.exports = async function () {
  try {
    const csv = await fetchText(CSV_URL);
    return buildAnnouncements(parseCsv(csv));
  } catch (error) {
    console.warn(
      `[announcements] Failed to fetch Google Sheet announcements: ${error.message}`
    );
    return { items: [], sticky: [], regular: [] };
  }
};
