import {Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript"

interface UserAttributes {
  id: number;
  email: string;
  password_hash: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserCreationAttributes {
  email: string;
  password_hash: string;
}

@Table
export class User extends Model<UserAttributes, UserCreationAttributes> {

  @PrimaryKey
  @Column
  public email!: string;

  @Column
  public password_hash!: string; // for nullable fields

  @Column
  @CreatedAt
  public createdAt: Date = new Date();

  @Column
  @UpdatedAt
  public updatedAt: Date = new Date();

  short(): {email: string} {
    return {
      email: this.email,
    }
  }
}
