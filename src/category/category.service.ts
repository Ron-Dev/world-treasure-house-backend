import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { slugify } from 'src/utils/slugify';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCategoryDto) {
    const slug = slugify(dto.name);
    return this.prisma.category.create({
      data: { ...dto, slug },
    });
  }

  findAll() {
    return this.prisma.category.findMany();
  }

  findOne(id: string) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    if (!category) throw new NotFoundException('Category not found');
    const slug = dto.name ? slugify(dto.name) : category.slug;
    return this.prisma.category.update({
      where: { id },
      data: { ...dto, slug },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // throws 404 if not found
    return this.prisma.category.delete({ where: { id } });
  }
}
