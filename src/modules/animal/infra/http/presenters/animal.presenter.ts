import { Animal } from "@/modules/animal/domain/entities/animal.entity";
import { AssetPresenter } from "@/modules/asset/infra/http/presenters/asset.presenter";
import { BreedPresenter } from "@/modules/breed/infra/http/breed.presenter";
import { differenceInYears } from "date-fns";

export class AnimalPresenter {
    static toHTTP(animal: Animal) {
        return {
            id: animal.id.toString(),
            name: animal.name,
            breed: animal.breed ? BreedPresenter.toHTTP(animal.breed) : undefined,
            age: animal.birthdate ? differenceInYears(new Date(), animal.birthdate) : null,
            weight: animal.weight,
            userId: animal.userId.toString(),
            asset: animal.asset
                ? AssetPresenter.toHTTP(animal.asset)
                : undefined,
        };
    }
}