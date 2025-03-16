import { InMemoryServiceRepository } from "test/repositories/in-memory-service-repository";
import { GetServiceByIdUseCase } from "./get-service-by-id.use-case";
import { beforeEach, describe, expect, it } from "vitest";
import { makeService } from "test/factories/make-service";

let inMemoryServicesRepository: InMemoryServiceRepository;
let useCase: GetServiceByIdUseCase;

describe("Get a service", () => {
    beforeEach(() => {
        inMemoryServicesRepository = new InMemoryServiceRepository();
        useCase = new GetServiceByIdUseCase(inMemoryServicesRepository);
    });

    it("should get a service by id", async () => {  
        const service = makeService();
        inMemoryServicesRepository.create(service);
        const result = await useCase.execute({
            id: service.id,
        });
        expect(result.isRight()).toBe(true);
        expect(result.value).toMatchObject({
            service: expect.objectContaining({
                name: service.name,
                description: service.description,
                price: service.price,
                companyId: service.companyId,
            })
        })
    }
    );
});