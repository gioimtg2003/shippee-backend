import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { phone as validPhone } from 'phone';

@ValidatorConstraint({ name: 'isPhoneNumber', async: false })
class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(phone: string) {
    const { isValid } = validPhone(phone, { country: 'VN' });
    const regex = new RegExp(
      '^(0|\\+84)(\\s|\\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\\d)(\\s|\\.)?(\\d{3})(\\s|\\.)?(\\d{3})$',
    );
    return isValid && regex.test(phone);
  }
}

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: 'Phone number is not a valid phone number',
        ...validationOptions,
      },
      validator: IsPhoneNumberConstraint,
    });
  };
}
