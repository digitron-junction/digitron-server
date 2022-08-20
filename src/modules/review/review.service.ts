import { Injectable } from '@nestjs/common';
import {
  NoPermissionToUpdateReviewException,
  ReviewAlreadyExistsException,
  ReviewNotfoundException,
} from '~/exception/service-exception/review.exception';
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
        deletedAt: null,
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

    return await this.prismaService.review.upsert({
      where: {
        productId_writerId: {
          writerId,
          productId: dto.productId,
        },
      },
      create: {
        writerId,
        productId: dto.productId,
        rating: dto.rating,
        content: dto.content,
        isBuyer,
      },
      update: {
        writerId,
        productId: dto.productId,
        rating: dto.rating,
        content: dto.content,
        isBuyer,
        deletedAt: null,
      },
      include: {
        writer: true,
      },
    });
  }

  async findOne(id: number) {
    const review = await this.prismaService.review.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        writer: true,
      },
    });

    if (review === null) {
      throw new ReviewNotfoundException();
    }

    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto, writerId: number) {
    const preReview = await this.prismaService.review.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (preReview === null) {
      throw new ReviewNotfoundException();
    }

    if (preReview.writerId !== writerId) {
      throw new NoPermissionToUpdateReviewException();
    }

    return await this.prismaService.review.update({
      where: {
        id,
      },
      data: {
        content: updateReviewDto.content,
        rating: updateReviewDto.rating,
      },
      include: {
        writer: true,
      },
    });
  }

  async remove(id: number, writerId: number) {
    const preReview = await this.prismaService.review.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (preReview === null) {
      throw new ReviewNotfoundException();
    }

    if (preReview.writerId !== writerId) {
      throw new NoPermissionToUpdateReviewException();
    }

    return await this.prismaService.review.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      include: {
        writer: true,
      },
    });
  }

  async findReviewsWithBuyerCondition(productId: number) {
    const reviews = await this.prismaService.review.findMany({
      where: {
        deletedAt: null,
        productId,
      },
      orderBy: {
        id: 'desc',
      },
      include: {
        writer: true,
      },
    });

    const buyerReviews = reviews.filter((review) => review.isBuyer);
    const nonBuyerReviews = reviews.filter((review) => !review.isBuyer);

    return {
      buyerReviews,
      nonBuyerReviews,
    };
  }
}
