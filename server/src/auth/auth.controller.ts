import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Req,
	Res,
	UnauthorizedException,
	UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import * as process from 'node:process';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
		const { refreshToken, ...response } = await this.authService.login(dto);
		this.authService.addRefreshTokenToResponse(res, refreshToken);
		return response;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
		const { refreshToken, ...response } = await this.authService.register(dto);
		this.authService.addRefreshTokenToResponse(res, refreshToken);
		return response;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login/access-token')
	async getNewTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const refreshTokenFromCookies = req.cookies[this.authService.REFRESH_TOKEN_NAME];
		if (!refreshTokenFromCookies) {
			this.authService.removeRefreshTokenFromResponse(res);
			throw new UnauthorizedException('Refresh token is not valid');
		}
		const { refreshToken, ...response } = await this.authService.getNewTokens(refreshTokenFromCookies);
		this.authService.addRefreshTokenToResponse(res, refreshToken);
		return response;
	}

	@HttpCode(200)
	@Post('logout')
	async logout(@Res({ passthrough: true }) res: Response) {
		this.authService.removeRefreshTokenFromResponse(res);
		return true;
	}

	@Post('google')
	async googleLogin(@Body('token') token: string) {
		return this.authService.validateOAuthLogin(token);
	}


}
