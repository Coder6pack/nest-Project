/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { PostsService } from './posts.service'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { AuthItem, ConditionGuard } from 'src/shared/constants/auth.constant'
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard'

@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@Get()
	@Auth([AuthItem.Bearer, AuthItem.APIKey], { condition: ConditionGuard.Or })
	getPosts() {
		return this.postsService.getPosts()
	}

	@Get(':id')
	getPost(@Param('id') id: string) {
		return this.postsService.getPost(Number(id))
	}

	@Post()
	createPost(@Body() body: any) {
		return this.postsService.createPost(body)
	}

	@Put(':id')
	updatePost(@Param('id') id: string, @Body() body: any) {
		return this.postsService.updatePost(Number(id), body)
	}

	@Delete(':id')
	deletePost(@Param('id') id: string) {
		return this.postsService.deletePost(Number(id))
	}
}
