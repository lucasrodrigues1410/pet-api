import { Disease } from "@/modules/disease/domain/entities/disease.entity";

export class DiseasePresenter {
	static present(disease: Disease) {
		return {
			id: disease.id.toString(),
			name: disease.name,
		};
	}
}
