import { Disease } from "@/modules/disease/domain/entities/disease.entity";
import { DiseasePresenter } from "./disease.presenter";

export class ListDiseasesPresenter {
	static present(diseases: Disease[]) {
		return {
			items: diseases.map((disease) => DiseasePresenter.present(disease)),
		};
	}
}
