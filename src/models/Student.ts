import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  sql,
} from '@sequelize/core';
import {
  Attribute,
  PrimaryKey,
  NotNull,
  AllowNull,
  Default,
  Unique,
  Table,
  HasOne,
  BelongsTo,
} from '@sequelize/core/decorators-legacy';
import { User } from './User';

@Table({
  tableName: 'student'
})
export class Student extends Model<
  InferAttributes<Student>,
  InferCreationAttributes<Student>
> {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @NotNull
  declare user_id: string;

  @BelongsTo(() => User, 'user_id')
  declare user: User;

  @Attribute(DataTypes.STRING)
  @AllowNull
  declare phone: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare address: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare gender: string;

  @Attribute(DataTypes.DATEONLY)
  @NotNull
  declare date_of_birth: Date

  @Attribute(DataTypes.STRING)
  @NotNull
  declare country: string
}
