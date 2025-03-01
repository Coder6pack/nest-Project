import { Exclude } from 'class-transformer'
import { IsString, Length } from 'class-validator'
import { Match } from 'src/shared/decorators/match.decorator'

export class LoginBodyDTO {
	@IsString()
	email: string
	@IsString()
	@Length(6, 20, { message: 'Password must be between 6 and 20 characters' })
	password: string
}

export class LoginResDTO {
	accessToken: string
	refreshToken: string

	constructor(partial: Partial<LoginResDTO>) {
		Object.assign(this, partial)
	}
}

export class RegisterBodyDTO extends LoginBodyDTO {
	@IsString()
	name: string
	@IsString()
	@Match('password', { message: 'Password and confirm password must match' })
	confirmPassword: string
}

export class RegisterResDTO {
	id: number
	name: string
	email: string
	@Exclude() password: string
	createdAt: Date
	updatedAt: Date

	constructor(partial: Partial<RegisterResDTO>) {
		Object.assign(this, partial)
	}
}

export class RefreshTokenBodyDTO {
	@IsString()
	refreshToken: string
}

export class RefreshTokenResDTO extends LoginResDTO {}

export class LogoutBodyDTO extends RefreshTokenBodyDTO {}
export class LogoutResDTO {
	@IsString()
	message: string
	constructor(partial: Partial<LogoutResDTO>) {
		Object.assign(this, partial)
	}
}
