import { Model, RelationMappings } from 'objection';
import { DevelompentStatusEnum } from 'src/shared/types/development-status.enum';
import { ResidenceStatusEnum } from '../../residence/domain/residence-status.enum';

export class Residence extends Model {
  id!: string;
  name!: string;
  status!: ResidenceStatusEnum
  developmentStatus!: DevelompentStatusEnum;
  subtitle!: string;
  description!: string;
  budgetStartRange!: number;
  budgetEndRange!: number;
  address!: string;
  longitude!: string;
  latitude!: string;

  static tableName = 'residences';
}
