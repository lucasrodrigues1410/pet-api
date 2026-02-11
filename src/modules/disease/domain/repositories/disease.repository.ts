import { Disease } from "../entities/disease.entity";

export interface FindDiseasesParams {
	query?: string;
}

export abstract class DiseaseRepository {
	abstract getAll(params: FindDiseasesParams): Promise<Disease[]>;
	abstract findById(id: string): Promise<Disease | null>;
	abstract create(disease: Disease): Promise<void>;
}
