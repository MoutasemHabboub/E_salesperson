import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Param,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateSalesDto } from '../dto/createSale.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../../../libs/common/src';
import { RoleGuard } from 'src/authentication/guards/role.guard';
import { ROLE } from 'src/authentication/enum/role.enum';
import { GetCommissionDto } from '../dto/getCommission.dto';

@ApiBearerAuth()
@ApiTags('Sales')
@Controller({
  path: 'sales',
  version: '1',
})
export class SalesController {
  constructor(private readonly salesService: SalesService) {}
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: CreateSalesDto,
    required: true,
  })
  //@ApiOkResponse({
  //  type: AgeDto,
  //  status: 200,
  //  description: 'created age',
  //})
  @UseGuards(AuthGuard(['jwt']))
  async addSale(@Body() data: CreateSalesDto, @CurrentUser() user) {
    const generatedId = await this.salesService.insertSale(data, user);
    return { id: generatedId };
  }
  @Post('/get-commission')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: CreateSalesDto,
    required: true,
  })
  @UseGuards(AuthGuard(['jwt']))
  async getCommission(@Body() data: GetCommissionDto, @CurrentUser() user) {
    return await this.salesService.calculateCommission(data, user);
  }

  @Post('/get-salesperson-commission/:id')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: CreateSalesDto,
    required: true,
  })
  @UseGuards(RoleGuard([ROLE.ADMIN]))
  async getSalespersonCommission(
    @Body() data: GetCommissionDto,
    @Param('id') id: number,
  ) {
    data.salespersonId = id;
    return await this.salesService.calculateCommission(data);
  }
}
