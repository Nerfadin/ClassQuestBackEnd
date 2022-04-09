import { IsNotEmpty, Length, IsOptional, IsString, IsPhoneNumber, IsEmail } from "class-validator"

export class RegisterTeacherDto {
    @IsNotEmpty()
    @Length(3)
    nome: string
    @IsOptional()
    @IsString()
    institution: string
    @IsOptional()
    @IsString()
    token?: string
    @IsNotEmpty()
    @IsPhoneNumber('BR')
    telefone: string
    @IsEmail()
    @IsNotEmpty()
    email: string
    @IsNotEmpty()
    @IsString()
    password: string
}