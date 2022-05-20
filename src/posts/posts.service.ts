import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Post } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    return await this.prisma.post.create({ data: createPostDto });
  }

  async findAll(): Promise<Post[]> {
    return await this.prisma.post.findMany();
  }

  async findOne(id: string): Promise<Post> {
    return await this.prisma.post.findUnique({ where: { id } });
  }

  async findOneByUserId(id: string): Promise<Post> {
    return await this.prisma.post.findFirst({
      where: { authorId: id },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    return await this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  async remove(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });

    if (!post) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: `Post with ID "${id}" not found`,
      });
    }

    await this.prisma.post.delete({ where: { id } });
  }
}
