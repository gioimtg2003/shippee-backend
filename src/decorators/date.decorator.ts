import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsLaterThan(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isLaterThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'object' &&
            typeof relatedValue === 'object' &&
            value > relatedValue
          );
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be later than ${args.constraints[0]}`;
        },
      },
    });
  };
}
