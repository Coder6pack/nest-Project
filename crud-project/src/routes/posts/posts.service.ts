import { Injectable, NotFoundException } from '@nestjs/common'
import { isNotFoundPrismaError } from 'src/shared/helpers'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreatePostDTO, UpdatePostDTO } from './post.dto'

@Injectable()
export class PostsService {
	constructor(private readonly prismaService: PrismaService) {}

	getPosts(userId: number) {
		return this.prismaService.post.findMany({
			where: { authorId: userId },
			include: {
				author: {
					omit: {
						password: true,
					},
				},
			},
		})
	}

	async getPost(postId: number, userId: number) {
		try {
			const post = await this.prismaService.post.findUniqueOrThrow({
				where: { id: postId, authorId: userId },
				include: {
					author: {
						omit: {
							password: true,
						},
					},
				},
			})
			return post
		} catch (error) {
			if (isNotFoundPrismaError(error)) {
				throw new NotFoundException('Post not found')
			}
			throw error
		}
	}

	createPost(body: CreatePostDTO, userId: number) {
		return this.prismaService.post.create({
			data: {
				title: body.title,
				content: body.content,
				authorId: userId,
			},
		})
	}
	async updatePost({ body, postId, userId }: { body: UpdatePostDTO; postId: number; userId: number }) {
		try {
			console.log(postId, userId)
			const post = await this.prismaService.post.update({
				where: { id: postId, authorId: userId },
				data: {
					title: body.title,
					content: body.content,
				},
				include: {
					author: {
						omit: {
							password: true,
						},
					},
				},
			})
			return post
		} catch (error) {
			if (isNotFoundPrismaError(error)) {
				throw new NotFoundException('Post not found')
			}
			throw error
		}
	}

	async deletePost(id: number, userId: number) {
		try {
			await this.prismaService.post.delete({
				where: {
					id,
					authorId: userId,
				},
			})
			return { message: `Post ${id} of author ${userId} deleted successfully'` }
		} catch (error) {
			if (isNotFoundPrismaError(error)) {
				throw new NotFoundException('Post not found')
			}
			throw error
		}
	}
}
