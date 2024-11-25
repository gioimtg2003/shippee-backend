import {
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: ' isImageFileName', async: false })
class IsImageFileNameConstraint implements ValidatorConstraintInterface {
  validate(fileName: string) {
    const suffix = fileName.split('.').pop();
    if (!suffix) {
      return false;
    }
    const allowedTypes = ['jpeg', 'png', 'jpg', 'apng', 'avif', 'webp'];
    return allowedTypes.includes(suffix as string);
  }
}

export function IsImageFileName() {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isImageFileName',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'File name is not a valid image file name',
      },
      validator: IsImageFileNameConstraint,
    });
  };
}
