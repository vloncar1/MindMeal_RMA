const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/send-email", async (req, res) => {
  const { email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "razvojmobilnihaplikacija7@gmail.com",
      pass: "boyq ejcd awov jxkx", // Generirani App Password
    },
  });

  const mailOptions = {
    from: "razvojmobilnihaplikacija7@gmail.com",
    to: "razvojmobilnihaplikacija7@gmail.com",
    subject: "Poruka iz Quasar aplikacije",
    text: "user:" + email + "\n" + "poruka:" + message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email sending failed", error);
    res.status(500).json({ message: "Email sending failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
