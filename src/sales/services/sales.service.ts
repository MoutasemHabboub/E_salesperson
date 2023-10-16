import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database';
import { CreateSalesDto } from '../dto/createSale.dto';
import { GetCommissionDto } from '../dto/getCommission.dto';

@Injectable()
export class SalesService {
  constructor(private readonly prisma: PrismaService) {}

  async insertSale(data: CreateSalesDto, user) {
    const sale = await this.prisma.sales.create({
      data: {
        salespersonId: user.id,
        ...data,
      },
    });
    return sale.id;
  }

  async calculateCommission(data: GetCommissionDto, user?) {
    if (!user) {
      if (!data.salespersonId) {
        throw new BadRequestException('salespersonId must have a value');
      }
      user = await this.prisma.user.findUnique({
        where: {
          id: data.salespersonId,
        },
      });
      if (!user) throw new NotFoundException('user not found');
    }
    const regions = await this.prisma.region.findMany({
      where: {
        id: data.regionId,
      },
      include: {
        sales: {
          where: {
            salespersonId: user.id,
            month: data.month,
            year: data.year,
          },
        },
      },
    });
    let totalCommission = 0;
    const commissions = [];
    for (const region of regions) {
      let regionCommission = 0;
      let amount = 0;
      for (const sale of region.sales) {
        if (sale.regionId === user.regionId) {
          if (sale.amount <= 1000000) {
            regionCommission += sale.amount * 0.05;
          } else {
            regionCommission += 1000000 * 0.05 + (sale.amount - 1000000) * 0.07;
          }
        } else {
          if (sale.amount <= 1000000) {
            regionCommission += sale.amount * 0.03;
          } else {
            regionCommission += 1000000 * 0.03 + (sale.amount - 1000000) * 0.04;
          }
        }
        totalCommission += regionCommission;
        amount += sale.amount;
      }
      commissions.push({
        region: region.name,
        commission: regionCommission,
        amount: amount,
      });
    }

    return { totalCommission, commissions, user };
  }

  async calculateCommissionInAllRegions(data: GetCommissionDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: data.salespersonId,
      },
    });
    if (!user) throw new NotFoundException('user not found');
    const regions = await this.prisma.region.findMany({
      where: {
        id: data.regionId,
      },
      include: {
        sales: {
          where: {
            salespersonId: user.id,
            month: data.month,
            year: data.year,
          },
        },
      },
    });
    let totalCommission = 0;
    const commissions = [];
    for (const region of regions) {
      let regionCommission = 0;
      let amount = 0;
      for (const sale of region.sales) {
        if (sale.regionId === user.regionId) {
          if (sale.amount <= 1000000) {
            regionCommission += sale.amount * 0.05;
          } else {
            regionCommission += 1000000 * 0.05 + (sale.amount - 1000000) * 0.07;
          }
        } else {
          if (sale.amount <= 1000000) {
            regionCommission += sale.amount * 0.03;
          } else {
            regionCommission += 1000000 * 0.03 + (sale.amount - 1000000) * 0.04;
          }
        }
        totalCommission += regionCommission;
        amount += sale.amount;
      }
      commissions.push({
        region: region.name,
        commission: regionCommission,
        amount: amount,
      });
    }

    return { totalCommission, commissions, user };
  }
}
