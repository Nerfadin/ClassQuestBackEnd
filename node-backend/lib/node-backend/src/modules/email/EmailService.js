"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = require("nodemailer");
const tsyringe_1 = require("../../utils/tsyringe");
let EmailService = class EmailService {
    constructor() {
        this.transporter = nodemailer_1.createTransport({
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
            secure: true,
            auth: {
                user: "apikey",
                pass: `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`,
            },
        });
    }
    async sendTeachersRegisterEmail(teacher) {
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
    async sendInviteTeacherEmail(sendEmailDto) {
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
    sendWebsiteContactformEmail(emailDto) {
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
};
EmailService = __decorate([
    tsyringe_1.Singleton()
], EmailService);
exports.EmailService = EmailService;
//# sourceMappingURL=EmailService.js.map