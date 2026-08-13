export interface Location {
  _id?: string;
  id?: string;
  jurisdiccionProvincia: string;
  zona: string;
  partidoComuna: string;
  barrioLocalidad: string;
  codigoPostal: string;
}

export interface LocationBulkResult {
  created: number;
  skipped: number;
  errors: string[];
}
