import { SchemaType, Tool } from '@google/generative-ai';

export const CUSTOMER_CONFIG_FUNCTION: Tool = {
  functionDeclarations: [
    {
      name: 'customer_update_name',
      description: 'This function is used to update customer name by id',
      parameters: {
        type: SchemaType.OBJECT,
        properties: {
          id: {
            type: SchemaType.NUMBER,
            description: 'Customer id',
          },
          name: {
            type: SchemaType.STRING,
            description: 'Customer name',
            nullable: false,
          },
        },
        required: ['id', 'name'],
      },
    },
  ],
};
