import { ResponseDTO } from '@common/dto';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

interface ApiResponseOptions<T> {
  type?: Type<T> | Array<Type<T>>;
  isArray?: boolean;
  description?: string;
  example?: any;
  nullable?: boolean;
}

export const ApiResponseDecorator = <T>(options: ApiResponseOptions<T>) => {
  const {
    type,
    isArray = false,
    description = 'Success response',
    example,
    nullable = false,
  } = options;

  let dataProperties: any = {};

  if (type) {
    dataProperties = {
      type: isArray ? 'array' : 'object',
      items: isArray ? { $ref: getSchemaPath(type as any) } : undefined,
      $ref: !isArray ? getSchemaPath(type as any) : undefined,
    };
  } else if (example !== undefined) {
    dataProperties = {
      type: typeof example,
      example,
    };
  }

  if (nullable) {
    dataProperties.nullable = true;
  }

  return applyDecorators(
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseDTO) },
          {
            properties: {
              data: dataProperties,
            },
          },
        ],
      },
    }),
  );
};

export const ApiSuccessResponse = (description?: string) =>
  ApiResponseDecorator({
    example: true,
    description,
  });

export const ApiNullResponse = (description?: string) =>
  ApiResponseDecorator({
    example: null,
    nullable: true,
    description,
  });

export const ApiArrayResponse = <T>(type: Type<T>, description?: string) =>
  ApiResponseDecorator({
    type,
    isArray: true,
    description,
  });

export const ApiObjectResponse = <T>(type: Type<T>, description?: string) =>
  ApiResponseDecorator({
    type,
    description,
  });
