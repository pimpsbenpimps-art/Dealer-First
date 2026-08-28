import { Router } from "express";
import nodemailer from "nodemailer";

const contactRouter = Router();
const recipients = ["Ahmed.jaouadi.aj@gmail.com", "sales@dealersf1rst.com"];

const requiredFields = [
  "firstName",
  "lastName",
  "dealershipName",
  "workEmail",
  "phoneNumber",
  "dealershipWebsite",
  "state",
  "monthlyLeadVolume",
  "needsHelpWith",
  "message",
] as const;

type ContactPayload = Record<(typeof requiredFields)[number], unknown> & {
  smsConsent?: unknown;
};

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

contactRouter.post("/contact", async (req, res) => {
  const payload = req.body as ContactPayload;
  const missingFields = requiredFields.filter((field) => {
    const value = payload[field];
    return Array.isArray(value) ? value.length === 0 : !text(value);
  });

  if (missingFields.length > 0) {
    res.status(400).json({ error: "All contact form fields are required.", missingFields });
    return;
  }

  const workEmail = text(payload.workEmail);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail)) {
    res.status(400).json({ error: "A valid work email is required." });
    return;
  }

  const smtpHost = text(process.env["SMTP_HOST"]);
  const smtpUser = text(process.env["SMTP_USER"]);
  const smtpPass = process.env["SMTP_PASS"];
  if (!smtpHost || !smtpUser || !smtpPass) {
    res.status(503).json({ error: "Lead delivery is not configured." });
    return;
  }

  const smtpPort = Number(process.env["SMTP_PORT"] || 587);
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const smsConsent = payload.smsConsent === true;
  const subject = `Dealership diagnostic request: ${text(payload.dealershipName)}`;
  const body = [
    "New dealership diagnostic request",
    "",
    `First name: ${text(payload.firstName)}`,
    `Last name: ${text(payload.lastName)}`,
    `Dealership: ${text(payload.dealershipName)}`,
    `Work email: ${workEmail}`,
    `Phone: ${text(payload.phoneNumber)}`,
    `Dealership website: ${text(payload.dealershipWebsite)}`,
    `State: ${text(payload.state)}`,
    `Monthly lead volume: ${text(payload.monthlyLeadVolume)}`,
    `Needs help with: ${Array.isArray(payload.needsHelpWith) ? payload.needsHelpWith.join(", ") : text(payload.needsHelpWith)}`,
    `SMS consent: ${smsConsent ? "Yes" : "No"}`,
    "",
    "Message:",
    text(payload.message),
  ].join("\n");

  try {
    await transporter.sendMail({
      from: smtpUser,
      to: recipients,
      replyTo: workEmail,
      subject,
      text: body,
    });
    res.status(204).send();
  } catch (error) {
    req.log?.error({ err: error }, "Failed to deliver contact lead");
    res.status(502).json({ error: "Unable to deliver the lead right now." });
  }
});

export default contactRouter;
