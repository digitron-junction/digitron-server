import { Injectable } from '@nestjs/common';
import { ReviewAlreadyExistsException } from '~/exception/service-exception/review.exception';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateReviewDto, writerId: number) {
    const review = await this.prismaService.review.findFirst({
      where: {
        writerId,
        productId: dto.productId,
      },
    });

    if (review !== null) {
      throw new ReviewAlreadyExistsException();
    }

    const isBuyer =
      (await this.prismaService.order.count({
        where: {
          productId: dto.productId,
          customerId: writerId,
        },
      })) > 0;

    return await this.prismaService.review.create({
      data: {
        writerId,
        productId: dto.productId,
        rating: dto.rating,
        content: dto.content,
        isBuyer,
      },
      include: {
        product: true,
      },
    });
  }

  findAll() {
    return `This action returns all review`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
