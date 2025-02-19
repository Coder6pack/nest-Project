import { Global, Module } from '@nestjs/common'
import { PrismaService } from './services/prisma.service'

const shareService = [PrismaService]

@Global()
@Module({
	providers: shareService,
	exports: shareService,
})
export class SharedModule {}
