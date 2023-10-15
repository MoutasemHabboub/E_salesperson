import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateSalesDto } from '../dto/createSale.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@app/common';

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
}
