export const CUSTOMER_FUNCTION_CALLING = {
  customer_update_name: {
    name: 'customer_update_name',
    description: 'This function is used to update customer name by id',
    parameters: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Customer id',
        },
        name: {
          type: 'string',
          description: 'Customer name',
          maxLength: 60,
        },
      },
      required: ['id', 'name'],
    },
  },
};
