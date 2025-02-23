import { UseCaseFactory } from "./UseCaseFactory";

const useCases = {
    createUser: UseCaseFactory.createUser(),
    loginUser: UseCaseFactory.loginUser(),
};

export { useCases };
