import { Injectable } from '@nestjs/common';

import { ImageInvalidException } from '~/exception/service-exception/image.exception';
import {
  NoPermissionToUpdateProductException,
  ProductNotExistsException,
} from '~/exception/service-exception/product.exception';
import { CloudflareService } from '../cloudflare/cloudflare.service';

import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly cloudflareService: CloudflareService,
  ) {}

  async createProduct(args: CreateProductDto & { storeId: number }) {
    const nonValidImageLength = (
      await Promise.all(
        args.imageIds.map(async (imageId) => {
          return await this.cloudflareService.validateImageUpload(imageId);
        }),
      )
    ).filter((a) => !a);

    if (nonValidImageLength.length > 0) {
      throw new ImageInvalidException();
    }

    return await this.prismaService.product.create({
      data: {
        images: { ids: args.imageIds },
        name: args.name,
        category: args.category,
        subCategory: args.subCategory,
        price: args.price,
        originalPrice: args.originalPrice,
        descrption: args.descrption,
        storeId: args.storeId,
      },
      include: { store: true },
    });
  }

  async getProductById(productId: number) {
    const product = await this.prismaService.product.findFirst({
      where: {
        id: productId,
        deletedAt: null,
      },
      include: {
        store: true,
      },
    });

    if (product === null) {
      throw new ProductNotExistsException();
    }

    return product;
  }

  async getProductsByStoreId(storeId: number) {
    const products = await this.prismaService.product.findMany({
      where: {
        storeId,
        deletedAt: null,
      },
      orderBy: {
        id: 'desc',
      },
      include: {
        store: true,
      },
    });

    return products;
  }

  async deleteProductById(productId: number, userStoreId: number) {
    const preProduct = await this.prismaService.product.findFirst({
      where: {
        id: productId,
        deletedAt: null,
      },
    });

    if (preProduct === null) {
      throw new ProductNotExistsException();
    }

    if (preProduct.storeId !== userStoreId) {
      throw new NoPermissionToUpdateProductException();
    }

    const product = await this.prismaService.product.update({
      data: {
        deletedAt: new Date(),
      },
      where: {
        id: productId,
      },
      include: {
        store: true,
      },
    });

    return product;
  }
}
