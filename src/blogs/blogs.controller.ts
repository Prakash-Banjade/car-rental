import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CurrentUser } from 'src/core/decorators/user.decorator';
import { Action, AuthUser } from 'src/core/types/global.types';
import { ChekcAbilities } from 'src/core/decorators/abilities.decorator';
import { QueryDto } from 'src/core/dto/query.dto';
import { Public } from 'src/core/decorators/setPublicRoute.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('blogs')
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) { }

  @ApiBearerAuth()
  @Post()
  @ChekcAbilities({ action: Action.CREATE, subject: 'all' })
  create(@Body() createBlogDto: CreateBlogDto, @CurrentUser() currentUser: AuthUser) {
    return this.blogsService.create(createBlogDto, currentUser);
  }

  @Public()
  @Get()
  findAll(@Query() queryDto: QueryDto) {
    return this.blogsService.findAll(queryDto);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @ChekcAbilities({ action: Action.UPDATE, subject: 'all' })
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogsService.update(id, updateBlogDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ChekcAbilities({ action: Action.DELETE, subject: 'all' })
  remove(@Param('id') id: string) {
    return this.blogsService.remove(id);
  }
}
