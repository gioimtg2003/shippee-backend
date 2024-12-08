import { IDriverSessionProps, IUserSessionProps } from '@common/interfaces';
import { DRIVER_STATUS_ENUM, Role } from '@constants';
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
  phone?: string;

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

export class DriverSession {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  balance?: number;

  @ApiProperty()
  isAiChecked?: boolean;

  @ApiProperty()
  isIdentityVerified?: boolean;

  @ApiProperty()
  lat?: number;

  @ApiProperty()
  lng?: number;

  @ApiProperty()
  state?: DRIVER_STATUS_ENUM;

  idOrder?: number;

  constructor(props: IDriverSessionProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.role = props.role;
    this.phone = props.phone;
    this.isAiChecked = props.isAiChecked;
    this.isIdentityVerified = props.isIdentityVerified;
  }
}

export const SelectedUserSessionFields: FindOptionsSelect<CustomerEntity> = {
  email: true,
  id: true,
  name: true,
};
