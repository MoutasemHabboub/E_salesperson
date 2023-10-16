import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../../src/database';
import { Prisma } from '@prisma/client';
const models = Prisma.dmmf.datamodel.models.map((m) => m.name);
type ModelsType = (typeof models)[number];
@ValidatorConstraint({ name: 'IsExist', async: true })
@Injectable()
export class IsExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    console.log(args.constraints);
    const [model, property = 'id'] = args.constraints;
    if (property === 'id') {
      try {
        value = parseInt(value);
      } catch (error) {
        throw new BadRequestException(error);
      }
    }
    if (!value || !model) {
      return false;
    }
    const modelName: ModelsType = model;
    const record = await this.prisma[modelName].findUnique({
      where: {
        [property]: value,
      },
    });
    console.log(record);
    if (record === null) {
      throw new NotFoundException(`${model} ${property} entered is not valid`);
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} entered is not valid`;
  }
}

export function IsExist(
  model: string,
  isExistField: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [model, isExistField],
      validator: IsExistConstraint,
    });
  };
}
