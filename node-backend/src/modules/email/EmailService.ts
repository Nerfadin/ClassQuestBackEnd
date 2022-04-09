import { createTransport } from "nodemailer";
import { Singleton } from "../../utils/tsyringe";
@Singleton()
export class EmailService {
  transporter = createTransport({
    // service: "Hotmail",
    // auth: {
    //   //classquestedu@gmail.com
    //   // user: "contato@classquest.com.br",
    //   // pass: "AcademiaDoConhecimento@0305",
    //   user: "jason.p08514@hotmail.com",
    //   pass: "",
    // },
    host: "smtp.sendgrid.net",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "apikey", // generated ethereal user
      pass: `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`, // generated ethereal password
    },
  });

  async sendTeachersRegisterEmail(teacher: any) {
    // TODO: Teacher
    const mailOptions = {
      from: `classquestedu@gmail.com`,
      to: [
        `classquestedu@gmail.com`,
        `contato@classquest.com.br`,
        `jason.p08514@gmail.com`,
      ],
      subject: `Novo registro na plataforma: ${teacher.nome}`,
      html: `
          <h2>Nome</h2>
          <h3>${teacher.nome}</h3>
          <h2>Email</h2>
          <p>${teacher.email}</p>
          <h2>Telefone</h2>
          <p>${teacher.telefone.replace("_", "")}</p>
      `,
    };
    const result = await this.transporter.sendMail(mailOptions);
    return result;
  }

  async sendInviteTeacherEmail(sendEmailDto: {
    email: string;
    name: string;
    institutionId: string;
    token: string;
  }) {
    const mailOptions = {
      from: "classquestedu@gmail.com",
      to: sendEmailDto.email,
      subject: "Convite para a ClassQuest",
      html: `
      Olá ${sendEmailDto.name}, você foi convidado para participar na ClassQuest.
          
      <a href="https://app.classquest.com.br/register?registerToken={${sendEmailDto.token}}"> Clique aqui para se registrar </a>
      `,
    };
    await this.transporter.sendMail(mailOptions);
    return;
  }

  sendWebsiteContactformEmail(emailDto: {
    email: string;
    mensagem: string;
    assunto: string;
  }) {
    const mailOptions = {
      from: "classquestedu@gmail.com",
      // from: `contato@classquest.com.br`,
      // from: ,
      to: [
        `classquestedu@gmail.com`,
        `contato@classquest.com.br`,
        `jason.p08514@gmail.com`,
        "classquestedu@gmail.com",
      ],
      subject: emailDto.assunto,
      html: `
          <h2>Email</h2>
          <h3>${emailDto.email}</h3>
          <h2>Mensagem</h2>
          <p>${emailDto.mensagem}</p>
      `,
    };
    return this.transporter.sendMail(mailOptions);
  }
}
