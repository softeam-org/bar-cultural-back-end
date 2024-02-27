import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

import { SortOrder } from '@utils/types';

@Injectable()
export class ParseSortOrderPipe implements PipeTransform<string, SortOrder> {
  transform(value?: string): SortOrder {
    if (value && value !== 'asc' && value !== 'desc') {
      throw new BadRequestException("Ordem só pode ser 'asc' ou 'desc'");
    }
    return value as SortOrder;
  }
}
