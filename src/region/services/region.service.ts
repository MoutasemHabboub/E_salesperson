import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database';
import { OptionsDto } from '../dto/OptionsDto';
import { RegionListDto } from '../dto/RegionListDto';
import { RegionDto } from '../dto/RegionDto';
import { CreateRegionDto } from '../dto/CreateRegionDto';
import { UpdateRegionDto } from '../dto/UpdateRegionDto';

@Injectable()
export class RegionService {
  constructor(private prisma: PrismaService) {}

  /***
   * Get all regions
   */
  async getAllRegion(options: OptionsDto): Promise<RegionListDto> {
    const findArgs = {
      skip: options.skip ?? 0,
      take: options.take ?? 10,
      include: {
        _count: true,
      },
    };
    const result = await this.prisma.region.findMany(findArgs);
    const regions = result.map((region) => {
      return new RegionDto(region);
    });
    const count = await this.prisma.region.aggregate({
      _count: true,
    });
    return { regions, count: count._count };
  }

  /***
   * Get region by id
   * @param id
   */
  async getRegion(id: number): Promise<RegionDto> {
    return new RegionDto(
      await this.prisma.region.findFirst({
        where: {
          id,
          //        status: true,
        },
        include: {
          _count: true,
        },
      }),
    );
  }

  /****
   * Create region
   * @param data
   */
  async createRegion(data: CreateRegionDto): Promise<any> {
    return this.prisma.region.create({
      data: {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  /***
   * Update region
   * @param id
   * @param data
   */
  async updateRegion(id: number, data: UpdateRegionDto): Promise<any> {
    return this.prisma.region.update({
      where: { id: data.id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  /***
   * Delete region
   * @param id
   */
  async deleteRegion(id: number): Promise<any> {
    const region = await this.prisma.region.findFirst({
      where: { id },
      include: { salespersons: true },
    });
    if (!region || region.salespersons.length > 0) {
      throw new BadRequestException('Region is not exist or has salespersons');
    }
    return this.prisma.region.delete({
      where: { id },
    });
  }

  // add look up function
  async regionLookup(options: OptionsDto): Promise<any[]> {
    const findArgs = {
      skip: options.skip ?? 0,
      take: options.take ?? 10,
    };
    return await this.prisma.region.findMany(findArgs);
  }
}
