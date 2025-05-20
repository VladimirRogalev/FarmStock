import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma.service';
import { RegisterDto } from './dto/register.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { verify } from 'argon2';
import { LoginDto } from './dto/login.dto';
import { OAuth2Client } from 'google-auth-library';
import * as process from 'node:process';
import { OAuthRegisterDto } from './dto/oauthregister.dto';

@Injectable()
export class AuthService {
	EXPIRE_DAY_REFRESH_TOKEN = 1;
	REFRESH_TOKEN_NAME = 'refreshToken';
	private oauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

	constructor(private jwt: JwtService,
				private userService: UserService,
				private prisma: PrismaService,
				private configService: ConfigService) {
	}

	async login(dto: LoginDto) {
		const user = await this.validateUser(dto);
		const tokens = this.issueTokens(user.id);
		return { user: user, ...tokens };
	}

	async register(dto: RegisterDto) {
		const oldUser = await this.userService.getByEmail(dto.email);

		if (oldUser) {
			throw new BadRequestException('This email is already in use');
		}
		const user = await this.userService.create(dto);
		const tokens = this.issueTokens(user.id);
		return { user: user, ...tokens };
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken);
		if (!result) {
			throw new UnauthorizedException('Refresh token in not a valid');
		}
		const user = await this.userService.getById(result.id);
		if (!user) {
			throw new UnauthorizedException('User not found');
		}
		const tokens = this.issueTokens(user.id);
		return { user, ...tokens };

	}

	issueTokens(userId: string) {
		const data = { id: userId };
		const accessToken = this.jwt.sign(data, {
			expiresIn: '1h'
		});
		const refreshToken = this.jwt.sign(data, {
			expiresIn: '7d'
		});
		return { accessToken, refreshToken };
	}

	private async validateUser(dto: LoginDto) {
		const user = await this.userService.getByEmail(dto.email);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		const isPasswordCorrect = await verify(user.password!, dto.password);
		if (!isPasswordCorrect) {
			throw new UnauthorizedException('Password is wrong');
		}
		return user;
	}

	async validateOAuthLogin(idToken: string) {
		const ticket = await this.oauthClient.verifyIdToken({
			idToken,
			audience: process.env.GOOGLE_CLIENT_ID
		});

		const payload = ticket.getPayload();
		if (!payload || !payload.email) {
			throw new UnauthorizedException('Invalid token');
		}

		const { email, given_name, family_name } = payload;
		let user = await this.userService.getByEmail(email);

		if (!user) {
			user = await this.userService.createWithOAuth({
				email,
				firstName: given_name || 'Google',
				lastName: family_name || 'User',
				oauthProvider: 'GOOGLE',
				password: null,
				roles: ['CUSTOMER'],
			});
		}
			const accessToken = this.jwt.sign({ id: user.id });

			return {
				accessToken,
				user: {
					id: user.id,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName
				}
			};

		}


	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date();
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);
		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain: this.configService.get('SERVER_DOMAIN'),
			expires: expiresIn,
			secure: true,
			sameSite: 'none'
		});
	}

	removeRefreshTokenFromResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			domain: this.configService.get('SERVER_DOMAIN'),
			expires: new Date(0),
			secure: true,
			sameSite: 'none'
		});
	}

}
