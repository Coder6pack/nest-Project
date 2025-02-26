import { ConflictException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { LoginBodyDTO, RegisterBodyDTO } from './auth.dto'
import { TokenService } from 'src/shared/services/token.service'
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helpers'

@Injectable()
export class AuthService {
	constructor(
		private readonly authSchema: PrismaService,
		private readonly hashing: HashingService,
		private readonly tokenService: TokenService,
	) {}
	async register(body: RegisterBodyDTO) {
		try {
			const password = await this.hashing.hash(body.password)
			const result = await this.authSchema.user.create({
				data: {
					email: body.email,
					password: password,
					name: body.name,
				},
			})
			return result
		} catch (error) {
			if (isUniqueConstraintPrismaError(error)) {
				throw new ConflictException('Email already exists')
			}
			throw error
		}
	}
	async generateTokens(payload: { userId: number }) {
		const [accessToken, refreshToken] = await Promise.all([
			await this.tokenService.signAccessToken(payload),
			this.tokenService.signRefreshToken(payload),
		])
		const decodeRefreshToken = await this.tokenService.verifyRefreshToken(refreshToken)
		await this.authSchema.refreshToken.create({
			data: {
				userId: decodeRefreshToken.userId,
				token: refreshToken,
				expiresAt: new Date(decodeRefreshToken.exp * 1000),
			},
		})
		return { accessToken, refreshToken }
	}
	async login(body: LoginBodyDTO) {
		const user = await this.authSchema.user.findUnique({
			where: {
				email: body.email,
			},
		})
		if (!user) {
			throw new UnauthorizedException('Account not found')
		}
		const isPasswordMatch = await this.hashing.compare(body.password, user.password)
		if (!isPasswordMatch) {
			throw new UnprocessableEntityException([
				{
					fields: 'password',
					error: 'Password is incorrect',
				},
			])
		}
		return await this.generateTokens({ userId: user.id })
	}
	async refreshToken(refreshToken: string) {
		try {
			// Decode the refresh token
			const user = await this.tokenService.verifyRefreshToken(refreshToken)
			// Find the refresh token in the database
			await this.authSchema.refreshToken.findUniqueOrThrow({
				where: {
					token: refreshToken,
				},
			})
			// Delete the refresh token from the database
			await this.authSchema.refreshToken.delete({
				where: {
					token: refreshToken,
				},
			})
			// Generate new access and refresh tokens
			return await this.generateTokens({ userId: user.userId })
		} catch (error) {
			if (isNotFoundPrismaError(error)) {
				throw new UnauthorizedException('Invalid refresh token')
			}
			throw new UnauthorizedException('Invalid refresh token')
		}
	}
}
