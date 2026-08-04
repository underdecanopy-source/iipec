import nodemailer from 'nodemailer'

export const getTransporter = () => {
  const host = process.env.SMTP_HOST?.trim()
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASSWORD?.trim()

  if (!host || !port || !user || !pass) {
    console.warn('SMTP environment variables are not fully configured.')
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465 || process.env.SMTP_SECURE === 'true', // Be flexible with secure flag
    auth: { user, pass },
  })
}