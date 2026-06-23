import { PrismaCrudModel } from 'src/shared/contracts/crud/prisma-crud-model.interface';

export abstract class AbstractPrismaCrudService<M extends PrismaCrudModel> {
  protected constructor(private readonly prismaModel: any) {}

  selectMany(query?: M['ListQuery']): Promise<M['Record'][]> {
    return this.prismaModel.findMany(query);
  }

  selectOne(where: M['UniqueWhere']): Promise<M['Record'] | null> {
    return this.prismaModel.findUnique({
      where,
    });
  }

  insertOne(data: M['CreateData']): Promise<M['Record']> {
    return this.prismaModel.create({
      data,
    });
  }

  updateOne(
    where: M['UniqueWhere'],
    data: M['UpdateData'],
  ): Promise<M['Record']> {
    return this.prismaModel.update({
      where,
      data,
    });
  }

  deleteOne(where: M['UniqueWhere']): Promise<M['Record']> {
    return this.prismaModel.delete({
      where,
    });
  }
}