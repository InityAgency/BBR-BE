import { Model, RelationMappings } from 'objection';
import { RequestTypeEnum } from './request-type.enum';
import { RequestStatusEnum } from './request-status.enum';
import { Lead } from '../../lead/domain/lead.entity';

export class Request extends Model {
  id!: string;
  leadId!: string;
  lead: Lead;
  type!: RequestTypeEnum;
  subject: string | null;
  message!: string;
  status!: RequestStatusEnum;
  entityId: string;
  note:string;

  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  static tableName = 'requests';

  static relationMappings: RelationMappings = {
    lead: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => Lead,
      join: {
        from: 'requests.leadId',
        to: 'leads.id',
      },
    },
  };

  async $beforeInsert() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }

  async $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
