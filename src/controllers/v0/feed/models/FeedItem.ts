import {Column, CreatedAt, ForeignKey, HasMany, Model, PrimaryKey, Table, UpdatedAt} from "sequelize-typescript"
import {User} from "../../users/models/User"

@Table
export class FeedItem extends Model<FeedItem> {
  @Column
  public caption!: string;

  @Column
  public url!: string;

  @Column
  @CreatedAt
  public createdAt: Date = new Date();

  @Column
  @UpdatedAt
  public updatedAt: Date = new Date();
}
