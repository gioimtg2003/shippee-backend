import { SPECIAL_REQUIRE_ENUM } from '@constants';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsSpecialRequireItem(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isSpecialRequireItem',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: string[]) {
          return value.every((item) =>
            Object.values(SPECIAL_REQUIRE_ENUM).includes(
              item as SPECIAL_REQUIRE_ENUM,
            ),
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid special require item`;
        },
      },
    });
  };
}
