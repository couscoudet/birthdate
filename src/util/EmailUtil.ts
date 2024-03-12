import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export default class EmailUtil {
  private transporter = nodemailer.createTransport({
    port: process.env.SMTP_PORT,
    host: process.env.SMTP_SERVER,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PWD,
    },
    secure: true,
    dkim: {
      domainName: process.env.DKIM_DOMAIN,
      keySelector: process.env.DKIM_KS,
      privateKey: process.env.DKIM_PK,
    },
  });

  receiver: string;

  confirmationToken: string;

  confirmationEmailData() {
    console.log(this.receiver);
    return {
      from: process.env.SMTP_USER,
      to: this.receiver,
      subject: "BirthDates : Merci de confirmer votre adresse email",
      text: `copiez ce lien dans votre navigateur : ${process.env.FRONTEND_BASE_URL}/confirm-my-email/${this.confirmationToken}`,
      html: `<html><b> Voici votre lien de confirmation</b>
    <a href=${process.env.FRONTEND_BASE_URL}/confirm-my-email/${this.confirmationToken}>Cliquez ici</a></html>`,
    };
  }

  sendConfirmationEmail() {
    this.transporter.sendMail(this.confirmationEmailData(), (err, info) => {
      if (err) {
        throw new Error(err);
      } else {
        console.log(info);
        return info;
      }
    });
  }

  emailConfirm(receiver: string, confirmationToken: string) {
    this.receiver = receiver;
    this.confirmationToken = confirmationToken;
    this.sendConfirmationEmail();
  }
}
