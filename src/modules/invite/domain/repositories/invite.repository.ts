import { User } from "@/modules/user/domain/entities/user.entity";
import { Invite } from "../entities/invite.entity";

export abstract class InviteRepository {
    abstract create(invite: Invite): Promise<void>;
    abstract findByToken(token: string): Promise<Invite & { user: User } | null>;
    abstract update(id: string, invite: Partial<Invite>): Promise<void>;
    abstract delete(id: string): Promise<void>;
}