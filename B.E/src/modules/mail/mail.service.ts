import nodemailer from "nodemailer"
import { env } from "@core/config/env.config"
import logger from "@core/utils/logger"
import { mailTemplates } from "./mail.templates"

class MailService {
    private transporter: nodemailer.Transporter

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: env.mail.host,
            port: env.mail.port,
            secure: env.mail.port === 465, // true for 465, false for other ports
            auth: {
                user: env.mail.user,
                pass: env.mail.pass,
            },
        })
    }

    async sendMail(to: string, subject: string, html: string) {
        if (!env.mail.user || !env.mail.pass) {
            logger.warn(`Skipping email to ${to}: Mail credentials not configured.`)
            return
        }

        try {
            const info = await this.transporter.sendMail({
                from: env.mail.from,
                to,
                subject,
                html,
            })
            logger.info(`Email sent to ${to}: ${info.messageId}`)
            return info
        } catch (error) {
            logger.error(`Error sending email to ${to}:`, error)
            throw error
        }
    }

    async sendProjectInvitation(email: string, projectName: string, inviterName: string, hasAccount: boolean) {
        const { subject, html } = mailTemplates.projectInvitation(projectName, inviterName, hasAccount)
        return await this.sendMail(email, subject, html)
    }
}

export const mailService = new MailService()
