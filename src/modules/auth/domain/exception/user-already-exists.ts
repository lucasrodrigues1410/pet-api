export class UserAlreadyExist extends Error {
    constructor() {
        super("Usuário já existe");
    }
}