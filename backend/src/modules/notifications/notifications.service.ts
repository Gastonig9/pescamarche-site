import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';
import {
  NotificationTemplate,
  NotificationTemplateDocument,
} from './schemas/notification-template.schema';

export interface CreateNotificationInput {
  type: string;
  title: string;
  body: string;
  link?: string;
  actorId?: string; // user who triggered this — they won't see it
  data?: Record<string, unknown>;
}

const DEFAULT_TEMPLATES = [
  {
    type: 'nueva_orden',
    label: 'Nueva orden',
    icon: '🛒',
    description: 'Se dispara cuando un cliente realiza un nuevo pedido.',
    enabled: true,
  },
  {
    type: 'pago_acreditado',
    label: 'Pago acreditado',
    icon: '💳',
    description: 'Se dispara cuando se confirma el pago de un pedido.',
    enabled: true,
  },
  {
    type: 'pago_rechazado',
    label: 'Pago rechazado',
    icon: '❌',
    description: 'Se dispara cuando MercadoPago rechaza un pago.',
    enabled: true,
  },
  {
    type: 'stock_bajo',
    label: 'Stock bajo',
    icon: '📦',
    description: 'Se dispara cuando el stock de un producto llega a 0.',
    enabled: true,
  },
  {
    type: 'pedido_enviado',
    label: 'Pedido enviado',
    icon: '📤',
    description: 'Se dispara cuando un pedido se marca como enviado.',
    enabled: true,
  },
  {
    type: 'importacion_completada',
    label: 'Importación completada',
    icon: '🔁',
    description: 'Se dispara al finalizar una carga masiva de datos.',
    enabled: true,
  },
  {
    type: 'usuario_creado',
    label: 'Usuario creado',
    icon: '👤',
    description:
      'Se dispara cuando se registra un nuevo usuario desde el dashboard.',
    enabled: true,
  },
];

@Injectable()
export class NotificationsService implements OnModuleInit {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
    @InjectModel(NotificationTemplate.name)
    private templateModel: Model<NotificationTemplateDocument>,
  ) {}

  // Seed default templates on startup if they don't exist yet
  async onModuleInit() {
    for (const tpl of DEFAULT_TEMPLATES) {
      await this.templateModel
        .updateOne({ type: tpl.type }, { $setOnInsert: tpl }, { upsert: true })
        .exec();
    }
  }

  async create(input: CreateNotificationInput): Promise<void> {
    const template = await this.templateModel
      .findOne({ type: input.type })
      .exec();
    if (template && !template.enabled) return;
    await this.notificationModel.create({ ...input, readBy: [] });
  }

  // Returns notifications visible to this user, with per-user 'read' field injected
  async findAll(
    userId: string,
    limit = 50,
  ): Promise<Record<string, unknown>[]> {
    const notActorFilter = {
      $or: [
        { actorId: { $exists: false } },
        { actorId: null },
        { actorId: { $ne: userId } },
      ],
    };
    const docs = await this.notificationModel
      .find(notActorFilter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
    return docs.map((doc) => ({
      ...doc.toJSON(),
      read: (doc.readBy ?? []).includes(userId),
    }));
  }

  async getUnreadCount(userId: string): Promise<{ count: number }> {
    const count = await this.notificationModel
      .countDocuments({
        readBy: { $ne: userId },
        $or: [
          { actorId: { $exists: false } },
          { actorId: null },
          { actorId: { $ne: userId } },
        ],
      })
      .exec();
    return { count };
  }

  async markRead(id: string, userId: string): Promise<void> {
    await this.notificationModel
      .findByIdAndUpdate(id, { $addToSet: { readBy: userId } })
      .exec();
  }

  async markAllRead(userId: string): Promise<void> {
    await this.notificationModel
      .updateMany(
        { readBy: { $ne: userId } },
        { $addToSet: { readBy: userId } },
      )
      .exec();
  }

  async deleteOne(id: string): Promise<void> {
    await this.notificationModel.findByIdAndDelete(id).exec();
  }

  // Templates CRUD
  findAllTemplates(): Promise<NotificationTemplate[]> {
    return this.templateModel.find().sort({ type: 1 }).exec();
  }

  async createTemplate(
    dto: Partial<NotificationTemplate>,
  ): Promise<NotificationTemplate> {
    return this.templateModel.create(dto);
  }

  async updateTemplate(
    id: string,
    dto: Partial<NotificationTemplate>,
  ): Promise<NotificationTemplate | null> {
    return this.templateModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async deleteTemplate(id: string): Promise<void> {
    await this.templateModel.findByIdAndDelete(id).exec();
  }
}
