import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as XLSX from 'xlsx';
import { LocationsService } from './locations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('locations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  findAll() {
    return this.locationsService.findAll();
  }

  @Get('count')
  count() {
    return this.locationsService.count();
  }

  @Delete()
  clearAll() {
    return this.locationsService.clearAll();
  }

  @Post('bulk')
  @UseInterceptors(FileInterceptor('file'))
  async bulkImport(
    @UploadedFile() file: { buffer: Buffer; originalname: string },
  ) {
    if (!file) {
      throw new BadRequestException('No se recibió ningún archivo.');
    }

    let workbook: XLSX.WorkBook;
    try {
      workbook = XLSX.read(file.buffer, { type: 'buffer' });
    } catch {
      throw new BadRequestException('El archivo no es un Excel válido.');
    }

    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

    if (rawRows.length === 0) {
      throw new BadRequestException('El archivo está vacío o no tiene datos.');
    }

    const rows = rawRows.map((row) => ({
      jurisdiccionProvincia:
        row['Jurisdicción / Provincia'] != null
          ? String(row['Jurisdicción / Provincia'])
          : '',
      zona: row['Zona'] != null ? String(row['Zona']) : '',
      partidoComuna:
        row['Partido / Comuna'] != null ? String(row['Partido / Comuna']) : '',
      barrioLocalidad:
        row['Barrio / Localidad'] != null
          ? String(row['Barrio / Localidad'])
          : '',
      codigoPostal:
        row['Código Postal (CPA / CP)'] != null
          ? String(row['Código Postal (CPA / CP)'])
          : '',
    }));

    return this.locationsService.bulkCreate(rows);
  }
}
