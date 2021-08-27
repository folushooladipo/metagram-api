import {Column, CreatedAt, Model, Table, UpdatedAt} from "sequelize-typescript"

interface FeedItemAttributes {
  id: number;
  caption: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

interface FeedItemCreationAttributes {
  caption: string;
  url: string;
}

@Table
export class FeedItem extends Model<FeedItemAttributes, FeedItemCreationAttributes> {
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
