import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import {
	LoginBodyDTO,
	LoginResDTO,
	LogoutBodyDTO,
	LogoutResDTO,
	RefreshTokenBodyDTO,
	RefreshTokenResDTO,
	RegisterBodyDTO,
	RegisterResDTO,
} from './auth.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	async register(@Body() body: RegisterBodyDTO) {
		const result = await this.authService.register(body)
		return new RegisterResDTO(result)
	}

	@Post('login')
	async login(@Body() body: LoginBodyDTO) {
		return new LoginResDTO(await this.authService.login(body))
	}

	@Post('refresh-token')
	async refreshToken(@Body() body: RefreshTokenBodyDTO) {
		return new RefreshTokenResDTO(await this.authService.refreshToken(body.refreshToken))
	}

	@Post('logout')
	async logout(@Body() body: LogoutBodyDTO) {
		return new LogoutResDTO(await this.authService.logout(body.refreshToken))
	}
}
