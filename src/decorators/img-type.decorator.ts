import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isImageType', async: false })
class IsImageTypeConstraint implements ValidatorConstraintInterface {
  validate(type: string) {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/apng',
      'image/avif',
      'image/webp',
    ];
    return allowedTypes.includes(type);
  }
}

export function IsImageType() {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isImageType',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'Type is not a valid image type',
      },
      validator: IsImageTypeConstraint,
    });
  };
}
