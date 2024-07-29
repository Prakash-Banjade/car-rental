import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthUser } from 'src/core/types/global.types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { ImagesService } from 'src/images/images.service';
import { QueryDto } from 'src/core/dto/query.dto';
import paginatedData from 'src/core/utils/paginatedData';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog) private readonly blogRepo: Repository<Blog>,
    private readonly imagesService: ImagesService,
    private readonly accountsService: AccountsService,
  ) { }

  async create(createBlogDto: CreateBlogDto, currentUser: AuthUser) {
    const account = await this.accountsService.findOne(currentUser.accountId);

    const existingWithSameTitle = await this.blogRepo.findOneBy({ title: createBlogDto.title });
    if (existingWithSameTitle) throw new ConflictException('Blog with same title already exists');

    const existingWithSameSlug = await this.blogRepo.findOneBy({ slug: createBlogDto.slug });
    if (existingWithSameSlug) throw new ConflictException('Blog with same slug already exists');

    // CREATE BLOG
    const featuredImage = await this.imagesService.findOne(createBlogDto.featuredImageId);
    const coverImage = createBlogDto.coverImageId ? await this.imagesService.findOne(createBlogDto.coverImageId) : null;

    const blog = this.blogRepo.create({
      ...createBlogDto,
      author: account.firstName + ' ' + account.lastName,
      featuredImage,
      coverImage,
    });
    const savedBlog = await this.blogRepo.save(blog);

    return {
      message: 'Blog created',
      blog: {
        id: savedBlog.id,
        title: savedBlog.title,
        author: savedBlog.author,
      }
    }
  }

  async findAll(queryDto: QueryDto) {
    const queryBuilder = this.blogRepo.createQueryBuilder('blog');

    queryBuilder
      .orderBy("blog.createdAt", queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.take)

    return paginatedData(queryDto, queryBuilder);
  }

  async findOne(id: string) {
    const foundBlog = await this.blogRepo.findOneBy({ id });
    if (!foundBlog) throw new NotFoundException('Blog not found');

    return foundBlog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    const existing = await this.findOne(id);

    if (updateBlogDto.title && updateBlogDto.title !== existing.title) {
      const existingWithSameTitle = await this.blogRepo.findOneBy({ title: updateBlogDto.title });
      if (existingWithSameTitle) throw new ConflictException('Blog with same title already exists');
    }

    if (updateBlogDto.slug && updateBlogDto.slug !== existing.slug) {
      const existingWithSameSlug = await this.blogRepo.findOneBy({ slug: updateBlogDto.slug });
      if (existingWithSameSlug) throw new ConflictException('Blog with same slug already exists');
    }

    const featuredImage = updateBlogDto.featuredImageId && (existing.featuredImage.id !== updateBlogDto.featuredImageId)
      ? await this.imagesService.findOne(updateBlogDto.featuredImageId)
      : existing.featuredImage;

    const coverImage = updateBlogDto.coverImageId
      ? await this.imagesService.findOne(updateBlogDto.coverImageId)
      : null;

    Object.assign(existing, { ...updateBlogDto, featuredImage, coverImage });
    const updatedBlog = await this.blogRepo.save(existing);

    return {
      message: 'Blog updated',
      blog: {
        id: updatedBlog.id,
        title: updatedBlog.title,
        author: updatedBlog.author,
      }
    }
  }

  async remove(id: string) {
    const existing = await this.findOne(id);
    const removedBlog = await this.blogRepo.remove(existing);

    return {
      message: 'Blog removed',
      blog: {
        id: removedBlog.id,
        title: removedBlog.title,
        author: removedBlog.author,
      }
    }
  }
}
