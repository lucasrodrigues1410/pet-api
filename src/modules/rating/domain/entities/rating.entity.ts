import { Entity } from "@/core/domain/entities/entity";

export interface RatingProps {
    companyId: string;
    userId: string;
    rating: number;
    comment?: string;
}

export class Rating extends Entity<RatingProps> {
   get companyId() {
    return this.props.companyId;
   }

   get userId() {
    return this.props.userId;
   }
   
   get rating() {
    return this.props.rating;
   }

   get comment() {
    return this.props.comment;
   }
   
   public static create(props: RatingProps): Rating {
    return new Rating(props);
   }
}