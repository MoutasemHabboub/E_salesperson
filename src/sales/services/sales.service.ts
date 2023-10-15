import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database';
import { CreateSalesDto } from '../dto/createSale.dto';

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

  async calculateCommission(
    salespersonId: number,
    month: number,
    year: number,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: salespersonId,
      },
      include: {
        sales: {
          where: {
            month,
            year,
          },
        },
      },
    });
    let commission = 0;
    for (const sale of user.sales) {
      if (sale.regionId === user.regionId) {
        if (sale.amount <= 1000000) {
          commission += sale.amount * 0.05;
        } else {
          commission += 1000000 * 0.05 + (sale.amount - 1000000) * 0.07;
        }
      } else {
        if (sale.amount <= 1000000) {
          commission += sale.amount * 0.03;
        } else {
          commission += 1000000 * 0.03 + (sale.amount - 1000000) * 0.04;
        }
      }
    }

    return commission;
  }
}
