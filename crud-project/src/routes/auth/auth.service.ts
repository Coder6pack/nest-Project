import { ConflictException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { HashingService } from 'src/shared/services/hashing.service'
import { PrismaService } from 'src/shared/services/prisma.service'
import { RegisterBodyDTO } from './auth.dto'

@Injectable()
export class AuthService {
	constructor(
		private readonly authSchema: PrismaService,
		private readonly hashing: HashingService,
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
		} catch (err) {
			if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
				throw new ConflictException('Email already exists')
			}
			throw err
		}
	}
}
