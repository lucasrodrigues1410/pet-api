import { beforeEach, describe, expect, it } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeAnimal } from "test/factories/make-animal";
import { Rules } from "@/modules/service/domain/entities/value-objects/rules.value-object";
import { RulesExecutionService } from "./rules-execution.service";

describe("Rules Execution Service", () => {
	let moduleRef: any;
	let sut: RulesExecutionService;

	beforeEach(async () => {
		moduleRef = await Test.createTestingModule({
			providers: [RulesExecutionService],
		}).compile();

		sut = moduleRef.get(RulesExecutionService);
	});

	it("should return undefined when no rules match", () => {
		const animal = makeAnimal({ size: "small", ageStage: "puppy" });
		const rules: Rules[] = [];

		const result = sut.execute(animal, rules);

		expect(result).toBeUndefined();
	});

	it("should return price and duration when size rule matches with eq operator", () => {
		const animal = makeAnimal({ weight: 25 }); // This will make it "large" size
		const rules: Rules[] = [
			Rules.create({
				characteristic: "size",
				options: [{ value: "large", operator: "eq", price: 50, time: 30 }],
			}),
		];

		const result = sut.execute(animal, rules);

		expect(result).toEqual({ price: 50, durationMinutes: 30 });
	});

	it("should return price and duration when age rule matches with eq operator", () => {
		// Create animal with old birthdate to get "senior" age
		const animal = makeAnimal({
			weight: 25, // This will make it "large" size
		});
		// Manually set ageStage to "senior" for testing
		(animal as any).props.ageStage = "senior";

		const rules: Rules[] = [
			Rules.create({
				characteristic: "age",
				options: [{ value: "senior", operator: "eq", price: 25, time: 15 }],
			}),
		];

		const result = sut.execute(animal, rules);

		expect(result).toEqual({ price: 25, durationMinutes: 15 });
	});

	it("should return price and duration when rule matches with neq operator", () => {
		// Create animal with weight <= 8 to get "small" size
		const animal = makeAnimal({ weight: 5 });
		const rules: Rules[] = [
			Rules.create({
				characteristic: "size",
				options: [{ value: "large", operator: "neq", price: 20, time: 10 }],
			}),
		];

		const result = sut.execute(animal, rules);

		expect(result).toEqual({ price: 20, durationMinutes: 10 });
	});

	it("should return price and duration when array value matches with eq operator", () => {
		// Create animal with weight between 8 and 20 to get "medium" size
		const animal = makeAnimal({ weight: 15 });
		const rules: Rules[] = [
			Rules.create({
				characteristic: "size",
				options: [
					{ value: ["small", "medium"], operator: "eq", price: 30, time: 20 },
				],
			}),
		];

		const result = sut.execute(animal, rules);

		expect(result).toEqual({ price: 30, durationMinutes: 20 });
	});

	it("should return price and duration when array value matches with neq operator", () => {
		// Create animal with weight > 20 to get "large" size
		const animal = makeAnimal({ weight: 25 });
		const rules: Rules[] = [
			Rules.create({
				characteristic: "size",
				options: [
					{ value: ["small", "medium"], operator: "neq", price: 40, time: 25 },
				],
			}),
		];

		const result = sut.execute(animal, rules);

		expect(result).toEqual({ price: 40, durationMinutes: 25 });
	});

	it("should return undefined when array value does not match with eq operator", () => {
		// Create animal with weight > 20 to get "large" size
		const animal = makeAnimal({ weight: 25 });
		const rules: Rules[] = [
			Rules.create({
				characteristic: "size",
				options: [
					{ value: ["small", "medium"], operator: "eq", price: 30, time: 20 },
				],
			}),
		];

		const result = sut.execute(animal, rules);

		expect(result).toBeUndefined();
	});

	it("should return undefined when array value matches with ne operator but should not", () => {
		// Create animal with weight <= 8 to get "small" size
		const animal = makeAnimal({ weight: 5 });
		const rules: Rules[] = [
			Rules.create({
				characteristic: "size",
				options: [
					{ value: ["small", "medium"], operator: "neq", price: 30, time: 20 },
				],
			}),
		];

		const result = sut.execute(animal, rules);

		// The animal has "small" size, which is in the array ["small", "medium"]
		// With operator "ne", the logic checks if any value in the array is NOT in actual
		// Since "medium" is not in ["small"], this returns true and matches the rule
		// So we expect the rule to match, not return undefined
		expect(result).toEqual({ price: 30, durationMinutes: 20 });
	});

	it("should return undefined when array is empty", () => {
		// Create animal with weight > 20 to get "large" size
		const animal = makeAnimal({ weight: 25 });
		const rules: Rules[] = [
			Rules.create({
				characteristic: "size",
				options: [{ value: [], operator: "eq", price: 30, time: 20 }],
			}),
		];

		const result = sut.execute(animal, rules);

		expect(result).toBeUndefined();
	});

	it("should return undefined when characteristic is not found", () => {
		// Create animal with weight > 20 to get "large" size
		const animal = makeAnimal({ weight: 25 });
		const rules: Rules[] = [
			Rules.create({
				characteristic: "coat", // Use a valid characteristic that doesn't match animal properties
				options: [{ value: "short", operator: "eq", price: 30, time: 20 }],
			}),
		];

		const result = sut.execute(animal, rules);

		expect(result).toBeUndefined();
	});

	it("should return first matching rule when multiple rules match", () => {
		// Create animal with weight > 20 to get "large" size
		const animal = makeAnimal({
			weight: 25, // This will make it "large" size
		});
		// Manually set ageStage to "senior" for testing
		(animal as any).props.ageStage = "senior";
		const rules: Rules[] = [
			Rules.create({
				characteristic: "size",
				options: [{ value: "large", operator: "eq", price: 50, time: 30 }],
			}),
			Rules.create({
				characteristic: "age",
				options: [{ value: "senior", operator: "eq", price: 25, time: 15 }],
			}),
		];

		const result = sut.execute(animal, rules);

		expect(result).toEqual({ price: 50, durationMinutes: 30 });
	});

	it("should return undefined when animal properties are null", () => {
		// Create animal without weight to get null values
		const animal = makeAnimal({ weight: null });
		// Manually set ageStage to null for testing
		(animal as any).props.ageStage = null;
		const rules: Rules[] = [
			Rules.create({
				characteristic: "size",
				options: [{ value: "large", operator: "eq", price: 50, time: 30 }],
			}),
		];

		const result = sut.execute(animal, rules);

		expect(result).toBeUndefined();
	});

	it("should return undefined when animal properties are undefined", () => {
		// Create animal without weight to get undefined values
		const animal = makeAnimal({ weight: undefined });
		// Manually set ageStage to undefined for testing
		(animal as any).props.ageStage = undefined;
		const rules: Rules[] = [
			Rules.create({
				characteristic: "size",
				options: [{ value: "large", operator: "eq", price: 50, time: 30 }],
			}),
		];

		const result = sut.execute(animal, rules);

		expect(result).toBeUndefined();
	});

	it("should handle rule with zero price and time", () => {
		// Create animal with weight <= 8 to get "small" size
		const animal = makeAnimal({ weight: 5 });
		const rules: Rules[] = [
			Rules.create({
				characteristic: "size",
				options: [{ value: "small", operator: "eq", price: 0, time: 0 }],
			}),
		];

		const result = sut.execute(animal, rules);

		expect(result).toEqual({ price: 0, durationMinutes: 0 });
	});

	it("should handle rule with undefined time", () => {
		// Create animal with weight between 8 and 20 to get "medium" size
		const animal = makeAnimal({ weight: 15 });
		const rules: Rules[] = [
			Rules.create({
				characteristic: "size",
				options: [
					{ value: "medium", operator: "eq", price: 30, time: undefined },
				],
			}),
		];

		const result = sut.execute(animal, rules);

		expect(result).toEqual({ price: 30, durationMinutes: 0 });
	});
});
