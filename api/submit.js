// api/submit.js

const Airtable = require("airtable");

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { name, email, message } = req.body;

  try {
    const created = await base(process.env.AIRTABLE_TABLE_NAME).create([
      {
        fields: {
            Name: name,
            Email: email,
            Message: message,
        },
      },
    ]);

    res.status(200).json({ id: created[0].id });
  } catch (error) {
    console.error("Airtable error:", error);
    res.status(500).json({ error: "Error saving to Airtable" });
  }
};
