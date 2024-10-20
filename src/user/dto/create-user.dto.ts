import {IsDate, IsEmail, IsOptional, IsPhoneNumber, IsString, IsStrongPassword} from 'class-validator';

export class CreateUserDto {
    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsPhoneNumber()
    @IsOptional()
    phone_number: string;

    @IsString()
    account_type: "Notary" | "Individual" | "Business"

    @IsString()
    @IsOptional()
    business_name: string;

    @IsString()
    @IsOptional()
    reg_number: string;

    @IsString()
    @IsOptional()
    sc_number: string;

    @IsString()
    @IsOptional()
    office_address: string;

    @IsEmail()
    email: string;

    @IsStrongPassword()
    password: string;

    @IsString()
    @IsOptional()
    city: string;

    @IsOptional()
    @IsString()
    gender: "Male" | "Female";

    @IsDate()
    @IsOptional()
    createdAt: Date;

    @IsDate()
    @IsOptional()
    updatedAt: Date;
}
