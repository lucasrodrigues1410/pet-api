import { Injectable } from "@nestjs/common";
import { Either, right } from "@/shared/either";
import { CompanyAvailability } from "../../domain/entities/company-availability.entity";
import { CompanyAvailabilityRepository } from "../../domain/repositories/company-availability.repository";

interface GetCompanyAvailabilityRequest {
  companyId: string;
}

type GetCompanyAvailabilityResponse = Either<null, { items: CompanyAvailability[] }>;

@Injectable()
export class GetCompanyAvailabilityUseCase {
  constructor(private readonly availabilityRepo: CompanyAvailabilityRepository) {}

  async execute({ companyId }: GetCompanyAvailabilityRequest): Promise<GetCompanyAvailabilityResponse> {
    const items = (await this.availabilityRepo.findAllByCompanyId(companyId)) || [];
    return right({ items });
  }
}


