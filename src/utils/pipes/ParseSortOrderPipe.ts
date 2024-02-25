import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

import { SortOrder } from '../types/SortOrder';

@Injectable()
export class ParseSortOrderPipe implements PipeTransform<string, SortOrder> {
  transform(value: string): SortOrder {
    if (!value) value = 'asc';
    if (value !== 'asc' && value !== 'desc') {
      throw new BadRequestException("Ordem só pode ser 'asc' ou 'desc'");
    }
    return value as SortOrder;
  }
}
