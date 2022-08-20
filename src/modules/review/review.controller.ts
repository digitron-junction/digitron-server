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
        review,
      },
    };
  }

  @Get()
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewService.remove(+id);
  }
}
