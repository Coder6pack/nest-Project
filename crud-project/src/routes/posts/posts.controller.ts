import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { PostsService } from './posts.service'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { AuthItem } from 'src/shared/constants/auth.constant'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { CreatePostDTO, GetPostItemDTO, UpdatePostDTO } from './post.dto'

@Controller('posts')
@Auth([AuthItem.Bearer])
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Get()
	getPosts(@ActiveUser('userId') userId: number) {
		return this.postsService.getPosts(userId).then((posts) => posts.map((post) => new GetPostItemDTO(post)))
	}

	@Get(':id')
	async getPost(@Param('id') id: string, @ActiveUser('userId') userId: number) {
		return new GetPostItemDTO(await this.postsService.getPost(Number(id), userId))
	}

	@Post()
	async createPost(@Body() body: CreatePostDTO, @ActiveUser('userId') userId: number) {
		return new GetPostItemDTO(await this.postsService.createPost(body, userId))
	}

	@Put(':id')
	async updatePost(@Param('id') id: string, @Body() body: UpdatePostDTO, @ActiveUser('userId') userId: number) {
		return new GetPostItemDTO(
			await this.postsService.updatePost({
				body,
				postId: Number(id),
				userId,
			}),
		)
	}

	@Delete(':id')
	deletePost(@Param('id') id: string, @ActiveUser('userId') userId: number): Promise<{ message: string }> {
		return this.postsService.deletePost(Number(id), userId)
	}
}
