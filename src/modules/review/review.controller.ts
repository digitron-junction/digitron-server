import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { RequiredUserGuard } from '~/guard/required-user.guard';
import { requiredUserHeader } from '~/config/constants';
import { RequiredUserRequest } from '~/types/request';
import { reviewEntityToDto } from './dto/review.dto';

@ApiTags('Review')
@Controller('/api/v1/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(RequiredUserGuard)
  @ApiHeader(requiredUserHeader)
  @Post()
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: RequiredUserRequest,
  ) {
    const review = await this.reviewService.create(
      createReviewDto,
      req.user.id,
    );

    return {
      data: {
        review: reviewEntityToDto(review),
      },
    };
  }

  @Get(':reviewId')
  async findOne(@Param('reviewId') reviewId: string) {
    const review = await this.reviewService.findOne(+reviewId);

    return {
      data: {
        review: reviewEntityToDto(review),
      },
    };
  }

  @UseGuards(RequiredUserGuard)
  @ApiHeader(requiredUserHeader)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req: RequiredUserRequest,
  ) {
    const review = await this.reviewService.update(
      +id,
      updateReviewDto,
      req.user.id,
    );

    return {
      data: {
        review: reviewEntityToDto(review),
      },
    };
  }

  @UseGuards(RequiredUserGuard)
  @ApiHeader(requiredUserHeader)
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: RequiredUserRequest) {
    const review = await this.reviewService.remove(+id, req.user.id);

    return {
      data: {
        review: reviewEntityToDto(review),
      },
    };
  }
}
