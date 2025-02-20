import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'
import { HashingService } from './services/hashing.service'

const shareService = [PrismaService, HashingService]

@Global()
@Module({
	providers: shareService,
	exports: shareService,
})
export class SharedModule {}
