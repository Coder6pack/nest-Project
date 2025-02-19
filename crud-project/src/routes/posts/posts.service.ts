/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'

@Injectable()
export class PostsService {
	constructor(private readonly prismaService: PrismaService) {}

	getPosts() {
		return this.prismaService.post.findMany()
	}

	getPost(id: number) {
		return this.prismaService.post.findUnique({
			where: { id },
		})
	}

	createPost(body: any) {
		return this.prismaService.post.create({
			data: {
				title: body.title,
				content: body.content,
				authorId: body.authorId,
			},
		})
	}

	updatePost(id: number, body: any) {
		return this.prismaService.post.update({
			where: { id },
			data: {
				title: body.title,
				content: body.content,
				authorId: body.authorId,
			},
		})
	}

	deletePost(id: number) {
		return this.prismaService.post.delete({
			where: { id },
		})
	}
}
