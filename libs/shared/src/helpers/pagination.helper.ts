import { HttpException, HttpStatus } from '@nestjs/common';
import { OrderByOption, PaginatedResult, PaginatorParams } from '../types/shared.type';
/* eslint-disable */
const paginator = async <T, R>({
  model,
  pageOptions,
  selectionOption,
}: PaginatorParams<T>): Promise<PaginatedResult<R>> => {
  const page = Number(pageOptions?.page) || 1;

  try {
    const itemsPerPage = Number(pageOptions?.itemsPerPage) || 10;
    const selectionCondition = selectionOption?.condition || { deletedAt: null };

    selectionCondition.deletedAt ??= null;
    // Check for conflicting 'include' and 'select'
    if (selectionOption?.include && selectionOption?.select) {
      throw new HttpException(
        'Both "select" and "include" are not allowed simultaneously in Prisma',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let orderBy: OrderByOption<T>[] = [];
    if (!selectionOption?.orderBy || selectionOption.orderBy.length === 0)
      orderBy = [{ createdAt: 'desc' }];
    else orderBy = selectionOption.orderBy;

    const skip = page > 0 ? itemsPerPage * (page - 1) : 0;

    // Fetch total count and paginated data in parallel
    const [total, data] = await Promise.all([
      model.count({ where: selectionCondition }),
      model.findMany({
        ...selectionOption,
        where: selectionCondition,
        orderBy,
        take: itemsPerPage,
        skip,
      }),
    ]);

    const lastPage = Math.ceil(total / itemsPerPage);

    return {
      data: data as R[],
      pagination: {
        page,
        itemsPerPage,
        total,
        lastPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null,
      },
    };
  } catch (error) {
    console.error('Error in paginator function:', error);
    throw new HttpException(
      'Something went wrong please try again',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
};

export default paginator;
