const Airtable = require("airtable");
const { Resend } = require("resend");

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // Save to Airtable
    const created = await base(process.env.AIRTABLE_TABLE_NAME).create([
      {
        fields: { Name: name, Email: email, Message: message },
      },
    ]);

    // Send confirmation email
    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: email,
      subject: "Thanks for contacting us!",
      html: `
        <h2>Hi ${name},</h2>
        <p>Thanks for reaching out! We’ve received your message:</p>
        <blockquote>${message}</blockquote>
        <p>We’ll get back to you as soon as possible.</p>
        <br/>
        <p>— Your Team</p>
      `,
    });

    res.status(200).json({ id: created[0].id });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
