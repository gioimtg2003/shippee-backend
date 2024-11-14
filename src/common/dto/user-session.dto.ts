import { IUserSessionProps } from '@common/interfaces';
import { Role } from '@constants';
import { CustomerEntity } from '@features/user/customer.entity';
import { ApiProperty } from '@nestjs/swagger';
import { FindOptionsSelect } from 'typeorm';

export class UserSession {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty()
  accessToken?: string;

  @ApiProperty()
  refreshToken?: string;

  constructor(props: IUserSessionProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.role = props.role;
  }
}

export const SelectedUserSessionFields: FindOptionsSelect<CustomerEntity> = {
  email: true,
  id: true,
  name: true,
};
