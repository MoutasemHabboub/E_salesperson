import { Controller, UseGuards } from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RegionListDto } from '../dto/RegionListDto';
import { RegionService } from '../services/region.service';
import { RegionDto } from '../dto/RegionDto';
import { CreateRegionDto } from '../dto/CreateRegionDto';
import { RoleGuard } from '../../authentication/guards/role.guard';
import { ROLE } from '../../authentication/enum/role.enum';
import { ValidateRegionIdDto } from '../dto/ValidateRegiondDto';
import { UpdateRegionDto } from '../dto/UpdateRegionDto';
import { OptionsDto } from '../dto/OptionsDto';

@UseGuards(AuthGuard(['jwt'])) // first success wins
@ApiBearerAuth()
@ApiTags('Region')
@Controller({
  path: 'region',
  version: '1',
})
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: RegionListDto,
    status: 200,
    description: 'List of regions',
  })
  @Get()
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
  })
  async getAllRegion(@Query() options: OptionsDto): Promise<RegionListDto> {
    return this.regionService.getAllRegion(options);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: CreateRegionDto,
    required: true,
  })
  @ApiOkResponse({
    type: RegionDto,
    status: 200,
    description: 'created Region',
  })
  @UseGuards(RoleGuard([ROLE.ADMIN]))
  async createRegion(@Body() data: CreateRegionDto): Promise<RegionDto> {
    return this.regionService.createRegion(data);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: RegionDto,
    status: 200,
    description: 'List of regions',
  })
  @Get('/lookup')
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'key',
    required: false,
    type: String,
  })
  //  @UseGuards(RoleGuard([ROLE.MANAGER,ROLE.ADMIN]))
  async regionLookup(@Query() options: OptionsDto): Promise<any[]> {
    return this.regionService.regionLookup(options);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ type: Number, name: 'id' })
  async getRegion(@Param() params: ValidateRegionIdDto): Promise<RegionDto> {
    return this.regionService.getRegion(params.id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: UpdateRegionDto,
    required: true,
  })
  @ApiParam({ type: Number, name: 'id' })
  @UseGuards(RoleGuard([ROLE.ADMIN]))
  async Update(
    @Param('id') id: number,
    @Body() data: UpdateRegionDto,
  ): Promise<RegionDto> {
    return this.regionService.updateRegion(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ type: Number, name: 'id' })
  @UseGuards(RoleGuard([ROLE.ADMIN]))
  async Delete(@Param() params: ValidateRegionIdDto): Promise<RegionDto> {
    return this.regionService.deleteRegion(params.id);
  }
}
