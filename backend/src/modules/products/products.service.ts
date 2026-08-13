import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

interface BulkRow {
  name: string;
  description: string;
  price: number;
  stock: number;
  sku?: string;
  brand?: string;
  category?: string;
  subcategory?: string;
}

export interface BulkImportResult {
  created: number;
  skipped: number;
  errors: string[];
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productModel.create(createProductDto);
  }

  findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
  }

  async findRelated(id: string, limit = 5): Promise<Record<string, unknown>[]> {
    const product = await this.productModel.findById(id).lean().exec();
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    const match: Record<string, unknown> = { _id: { $ne: product._id } };
    if (product.category) {
      match.category = product.category;
    }

    // $sample returns random documents — add id virtual manually
    return this.productModel.aggregate([
      { $match: match },
      { $sample: { size: limit } },
      { $addFields: { id: { $toString: '$_id' } } },
    ]);
  }

  async bulkCreate(rows: BulkRow[]): Promise<BulkImportResult> {
    const valid: BulkRow[] = [];
    const errors: string[] = [];

    rows.forEach((row, i) => {
      const rowNum = i + 2; // +2: header row + 1-based index
      if (!row.name || !row.description) {
        errors.push(`Fila ${rowNum}: Nombre y Descripción son obligatorios.`);
        return;
      }
      const price = Number(row.price);
      const stock = Number(row.stock);
      if (isNaN(price) || price < 0) {
        errors.push(`Fila ${rowNum}: Precio inválido (${row.price}).`);
        return;
      }
      if (isNaN(stock) || stock < 0) {
        errors.push(`Fila ${rowNum}: Stock inválido (${row.stock}).`);
        return;
      }
      valid.push({ ...row, price, stock });
    });

    if (valid.length === 0) {
      return { created: 0, skipped: rows.length, errors };
    }

    // ordered: false continues inserting even if one document fails (e.g. duplicate SKU)
    const inserted = await this.productModel.insertMany(
      valid.map((r) => ({
        name: r.name.trim(),
        description: r.description.trim(),
        price: r.price,
        stock: r.stock,
        sku: r.sku?.trim() || undefined,
        brand: r.brand?.trim() || undefined,
        category: r.category?.trim() || undefined,
        subcategory: r.subcategory?.trim() || undefined,
        images: [],
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
