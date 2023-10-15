import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database';
import { Prisma } from '@prisma/client';

const models = Prisma.dmmf.datamodel.models.map((m) => m.name);
type ModelsType = (typeof models)[number];
@ValidatorConstraint({ name: 'Unique', async: true })
@Injectable()
export class UniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [model, property = 'id', exceptField = null] = args.constraints;
    if (!value || !model) return false;
    const modelName: ModelsType = model;
    const record = await this.prisma[modelName].findUnique({
      where: {
        [property]: value,
      },
    });
    if (record === null) return true;

    if (!exceptField) return false;

    const exceptFieldValue = (args.object as any)[exceptField];
    if (!exceptFieldValue) return false;

    return record[exceptField] === exceptFieldValue;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} entered is not valid`;
  }
}

export function Unique(
  model: string,
  uniqueField: string,
  exceptField: string = null,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [model, uniqueField, exceptField],
      validator: UniqueConstraint,
    });
  };
}
