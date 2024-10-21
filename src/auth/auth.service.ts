import {ConflictException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import {UserService} from "../user/user.service";
import * as argon2 from 'argon2';
import {ErrorHandler} from "../utils";
import * as otpGenerator from 'otp-generator';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import {MailService} from "../mailservice/mailservice.service";
import {PrismaClient} from "@prisma/client";
import {JwtPayload, Tokens} from "./interfaces";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private redisClient: Redis;
  private readonly prisma = new PrismaClient();

  constructor(
      private readonly userService: UserService,
      private readonly configService: ConfigService,
      private readonly mailService: MailService,
      private readonly jwtService: JwtService
  ) {
    // Initialize Redis client
    this.redisClient = new Redis({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
      password: this.configService.get('REDIS_PASSWORD'),
    });
  }

  async loginAccount(req: any): Promise<any>{
    try{
      console.log(req);
      const user = await this.userService.findUserByEmail(req.user.email);
    }catch(error){
      ErrorHandler.handleError("Login.Account.Error", error);
    }
  }

  async validateUser({ email, password }: { email: string; password: string }) {
    //check if user exist
    const user = await this.userService.findUserByEmail(email);

    if (!user){
      return null;
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
     return null;
    }

    return user;
  }

  async register(createAuthDTO: CreateAuthDto): Promise<{ message: string; status: number }> {
    try {
      //check to confirm if user data already exist in the data
      const user = await this.userService.findUserByEmail(createAuthDTO.email);

      // if user already exist, return an exception
      if (user) {
        throw new ConflictException('A user with this email already exists');
      }

      const hashedPassword = await argon2.hash(createAuthDTO.password);

      await this.prisma.user.create({
        data: {
          ...createAuthDTO,
          password: hashedPassword
        },
      });

      const otp = await this.sendOTP(createAuthDTO.email, "Otp verification email");

      console.log(otp);

      return {
        status: 200,
        message: "User created successfully"
      }
    }catch (error){
      ErrorHandler.handleError("Register.User", error);
      throw error;
    }
  }

  /**
   * Retrieves the access and refresh tokens for the given JWT payload.
   *
   * @param {JwtPayload} jwtPayload - The JWT payload containing user information.
   * @return {Promise<Tokens>} - A promise that resolves to an object with the access and refresh tokens.
   */
  async getTokens(jwtPayload: JwtPayload): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('jwt.access_token_secret'),
        expiresIn: this.configService.get('jwt.access_token_expires'),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get('jwt.refresh_token_secret'),
        expiresIn: this.configService.get('jwt.refresh_token_expires'),
      }),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  /**
   * Generates and sends OTP to user's email
   * @param email User's email address
   * @param purpose Purpose of OTP (e.g., 'signup', 'reset-password')
   * @returns Generated OTP
   */
  async sendOTP(email: string, purpose: string): Promise<string> {
    try {
      // Generate OTP
      const otp = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });

      // Store OTP in Redis with 5 minutes expiry
      const key = `otp:${purpose}:${email}`;
      await this.redisClient.set(key, otp, 'EX', 300); // 300 seconds = 5 minutes

      // Email template for OTP
      const template = `
          <h2>Your OTP Code</h2>
          <p>Here is your OTP code for {{purpose}}:</p>
          <h1>{{otp}}</h1>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        `;

      // Send OTP via email
      await this.mailService.sendEmail({
        to: email,
        subject: `Your OTP Code for ${purpose}`,
        template,
        data: {
          otp,
          purpose,
        },
      });

      return otp;
    } catch (error) {
      ErrorHandler.handleError('MailService.sendOTP', error);
      throw error;
    }
  }

  /**
   * Verifies the OTP provided by the user
   * @param email User's email address
   * @param purpose Purpose of OTP
   * @param otp OTP to verify
   * @returns boolean indicating if OTP is valid
   */
  async verifyOTP(email: string, purpose: string, otp: string): Promise<{ status: number; message: string; }> {
    try {
      //check to confirm if user data already exist in the data
      const user = await this.userService.findUserByEmail(email);

      // if user already exist, return an exception
      if (!user) {
        throw new NotFoundException('User Not Found');
      }

      if (user.verified === "true"){
        throw new Error("User with this email is already verified");
      }

      const key = `otp:${purpose}:${email}`;
      const storedOTP = await this.redisClient.get(key);

      if (!storedOTP) {
        throw new UnauthorizedException("Invalid otp"); // OTP expired or doesn't exist
      }

      const isValid = storedOTP === otp;

      if (isValid) {
        // Delete OTP after successful verification
        await this.redisClient.del(key);

        const updateUser = await this.prisma.user.update({
          where: {
            email,
          },
          data: {
            verified: "true",
          },
        });

        console.log(updateUser);
      }else{
        throw new UnauthorizedException("Invalid or expired otp"); // OTP expired or doesn't exist
      }

      return {
        status: 200,
        message: "OTP verified successfully!"
      };
    } catch (error) {
      ErrorHandler.handleError('MailService.verifyOTP', error);
      throw error;
    }
  }
}
