import { BadRequestException, Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { ListDiseasesUseCase } from "@/modules/disease/application/use-cases/list-diseases.use-case";
import { Public } from "@/modules/auth/infra/http/decorators/public.decorator";
import { DiseaseListResponse } from "../dtos/disease.response.dto";
import { ListDiseasesPresenter } from "../presenters/list-diseases.presenter";
import { DiseaseRepository } from "@/modules/disease/domain/repositories/disease.repository";
import { Disease } from "@/modules/disease/domain/entities/disease.entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { z } from "zod";

const CreateDiseaseDto = z.object({
	id: z.string(),
	name: z.string().min(1),
});

type CreateDiseaseDtoType = z.infer<typeof CreateDiseaseDto>;

@ApiTags("Doenças")
@Controller("diseases")
export class DiseaseController {
	constructor(
		private readonly listDiseasesUseCase: ListDiseasesUseCase,
		private readonly diseaseRepository: DiseaseRepository,
	) {}

	@Get()
	@Public()
	@ApiOperation({
		summary: "Listar todas as doenças cadastradas",
		operationId: "getAllDiseases",
	})
	@ZodResponse({ status: 200, type: DiseaseListResponse })
	async getAll(@Query("search") search?: string): Promise<DiseaseListResponse> {
		const result = await this.listDiseasesUseCase.execute(search);
		if (result.isLeft()) {
			throw new BadRequestException();
		}
		return ListDiseasesPresenter.present(result.value.items);
	}

	@Post()
	@Public()
	@ApiOperation({
		summary: "Criar uma doença (temporário para seeding)",
		operationId: "createDisease",
	})
	async create(@Body() data: CreateDiseaseDtoType) {
		const validated = CreateDiseaseDto.parse(data);
		const disease = Disease.create({ name: validated.name }, new UniqueEntityID(validated.id));
		await this.diseaseRepository.create(disease);
		return { id: validated.id, name: validated.name };
	}
}
