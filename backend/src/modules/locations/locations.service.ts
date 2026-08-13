import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationDocument } from './schemas/location.schema';

interface LocationRow {
  jurisdiccionProvincia?: string;
  zona?: string;
  partidoComuna?: string;
  barrioLocalidad?: string;
  codigoPostal?: string;
}

export interface LocationBulkResult {
  created: number;
  skipped: number;
  errors: string[];
}

@Injectable()
export class LocationsService {
  constructor(
    @InjectModel(Location.name)
    private locationModel: Model<LocationDocument>,
  ) {}

  findAll(): Promise<Location[]> {
    return this.locationModel
      .find()
      .sort({ jurisdiccionProvincia: 1, barrioLocalidad: 1 })
      .exec();
  }

  count(): Promise<number> {
    return this.locationModel.countDocuments().exec();
  }

  async clearAll(): Promise<{ deleted: number }> {
    const result = await this.locationModel.deleteMany({}).exec();
    return { deleted: result.deletedCount };
  }

  async findDistinctPartidos(zone: string): Promise<string[]> {
    const filter =
      zone === 'caba'
        ? { jurisdiccionProvincia: { $regex: 'CABA', $options: 'i' } }
        : {
            jurisdiccionProvincia: {
              $not: { $regex: 'CABA', $options: 'i' },
              $ne: '',
            },
          };
    const result = await this.locationModel
      .distinct('partidoComuna', filter)
      .exec();
    return (result as string[]).filter(Boolean).sort();
  }

  async findDistinctBarrios(partido: string): Promise<string[]> {
    const result = await this.locationModel
      .distinct('barrioLocalidad', { partidoComuna: partido })
      .exec();
    return (result as string[]).filter(Boolean).sort();
  }

  async bulkCreate(rows: LocationRow[]): Promise<LocationBulkResult> {
    const valid: LocationRow[] = [];
    const errors: string[] = [];

    rows.forEach((row, i) => {
      if (!row.barrioLocalidad && !row.codigoPostal) {
        errors.push(`Fila ${i + 2}: Barrio/Localidad y Código Postal vacíos.`);
        return;
      }
      valid.push(row);
    });

    if (valid.length === 0) {
      return { created: 0, skipped: rows.length, errors };
    }

    const inserted = await this.locationModel.insertMany(
      valid.map((r) => ({
        jurisdiccionProvincia: r.jurisdiccionProvincia?.trim() || '',
        zona: r.zona?.trim() || '',
        partidoComuna: r.partidoComuna?.trim() || '',
        barrioLocalidad: r.barrioLocalidad?.trim() || '',
        codigoPostal: r.codigoPostal?.trim() || '',
      })),
      { ordered: false },
    );

    return {
      created: inserted.length,
      skipped: rows.length - inserted.length,
      errors,
    };
  }
}
