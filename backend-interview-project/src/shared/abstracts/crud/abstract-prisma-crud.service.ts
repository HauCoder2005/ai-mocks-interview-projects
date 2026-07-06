import { PrismaCrudModel } from 'src/shared/contracts/crud/prisma-crud-model.interface';

export abstract class AbstractPrismaCrudService<M extends PrismaCrudModel> {
  protected constructor(private readonly prismaModel: any) {}

  /*
   * Bắt buộc class con phải tự khai báo selectMany.
   * Nếu repository kế thừa mà không implement method này thì TypeScript sẽ báo lỗi.
   */
  abstract selectMany(query?: M['ListQuery']): Promise<M['Record'][]>;

  /*
   * Bắt buộc class con phải tự khai báo selectOne.
   */
  abstract selectOne(where: M['UniqueWhere']): Promise<M['Record'] | null>;

  /*
   * Bắt buộc class con phải tự khai báo insertOne.
   */
  abstract insertOne(data: M['CreateData']): Promise<M['Record']>;

  /*
   * Bắt buộc class con phải tự khai báo updateOne.
   */
  abstract updateOne(
    where: M['UniqueWhere'],
    data: M['UpdateData'],
  ): Promise<M['Record']>;

  /*
   * Bắt buộc class con phải tự khai báo deleteOne.
   */
  abstract deleteOne(where: M['UniqueWhere']): Promise<M['Record']>;

  /*
   * Hàm dùng chung cho class con gọi lại.
   * Logic Prisma thật sự nằm ở đây để tránh lặp code quá nhiều.
   */
  protected executeSelectMany(query?: M['ListQuery']): Promise<M['Record'][]> {
    return this.prismaModel.findMany(query);
  }

  /*
   * Hàm dùng chung cho class con gọi lại.
   */
  protected executeSelectOne(
    where: M['UniqueWhere'],
  ): Promise<M['Record'] | null> {
    return this.prismaModel.findUnique({
      where,
    });
  }

  /*
   * Hàm dùng chung cho class con gọi lại.
   */
  protected executeInsertOne(data: M['CreateData']): Promise<M['Record']> {
    return this.prismaModel.create({
      data,
    });
  }

  /*
   * Hàm dùng chung cho class con gọi lại.
   */
  protected executeUpdateOne(
    where: M['UniqueWhere'],
    data: M['UpdateData'],
  ): Promise<M['Record']> {
    return this.prismaModel.update({
      where,
      data,
    });
  }

  /*
   * Hàm dùng chung cho class con gọi lại.
   */
  protected executeDeleteOne(where: M['UniqueWhere']): Promise<M['Record']> {
    return this.prismaModel.delete({
      where,
    });
  }
}
