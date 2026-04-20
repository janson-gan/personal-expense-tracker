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
} from '@sequelize/core/decorators-legacy';

@Table({
  tableName: 'students'
})
export class Student extends Model<
  InferAttributes<Student>,
  InferCreationAttributes<Student>
> {
  @Attribute(DataTypes.UUID)
  @PrimaryKey
  @NotNull
  @Default(sql.uuidV4)
  declare student_id: CreationOptional<string>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare name: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  @Unique
  declare email: string;

  @Attribute(DataTypes.STRING)
  @AllowNull
  declare phone: string | null;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare address: string
}
