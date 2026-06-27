/**
 * PrismaCrudModel là interface dùng để mô tả "vai trò type" của một Prisma model.
 *
 * Hiểu đơn giản:
 * * Mỗi bảng/model Prisma như User, Job, Interview... sẽ có nhiều type khác nhau.
 * * Ví dụ User sẽ có:
 * * User: kiểu dữ liệu trả về sau khi query.
 * * Prisma.UserWhereUniqueInput: kiểu điều kiện tìm một user duy nhất.
 * * Prisma.UserCreateInput: kiểu dữ liệu tạo user.
 * * Prisma.UserUpdateInput: kiểu dữ liệu cập nhật user.
 * * Prisma.UserFindManyArgs: kiểu query danh sách user.
 *
 * Interface này gom các type đó vào một nơi.
 *
 * Sau đó AbstractPrismaCrudService<M> sẽ nhận M thông qua generic <>.
 * Hàm nào cần vai trò nào thì lấy đúng type tương ứng trong interface M ra dùng.
 *
 * Ví dụ:
 * * selectMany() cần query danh sách
 * => dùng M['ListQuery']
 *
 * * selectOne() cần điều kiện unique
 * => dùng M['UniqueWhere']
 *
 * * insertOne() cần dữ liệu tạo mới
 * => dùng M['CreateData']
 *
 * * updateOne() cần điều kiện unique và dữ liệu cập nhật
 * => dùng M['UniqueWhere'] và M['UpdateData']
 *
 * * deleteOne() cần điều kiện unique
 * => dùng M['UniqueWhere']
 *
 * * Các hàm trả dữ liệu về thì dùng M['Record']
 *
 * Lưu ý quan trọng:
 * * Generic <M> chỉ giúp TypeScript biết đúng kiểu dữ liệu khi code.
 * * Generic <M> không tự query database được.
 * * Prisma model thật để query vẫn phải truyền vào constructor,
 * ví dụ: super(prisma.user).
 *
 * Ví dụ:
 *
 * export interface UserPrismaModel extends PrismaCrudModel {
 *   Record: User;
 *   UniqueWhere: Prisma.UserWhereUniqueInput;
 *   CreateData: Prisma.UserCreateInput;
 *   UpdateData: Prisma.UserUpdateInput;
 *   ListQuery: Prisma.UserFindManyArgs;
 * }
 *
 * Khi đó:
 *
 * AbstractPrismaCrudService<UserPrismaModel>
 *
 * sẽ hiểu:
 * * selectMany() trả về User[]
 * * selectOne() trả về User | null
 * * insertOne() nhận Prisma.UserCreateInput
 * * updateOne() nhận Prisma.UserUpdateInput
 * * deleteOne() nhận Prisma.UserWhereUniqueInput
 **/

export interface PrismaCrudModel {
  Record: unknown;
  UniqueWhere: unknown;
  CreateData: unknown;
  UpdateData: unknown;
  ListQuery?: unknown;
}
