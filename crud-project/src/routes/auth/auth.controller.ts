import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import {
	LoginBodyDTO,
	LoginResDTO,
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
}
