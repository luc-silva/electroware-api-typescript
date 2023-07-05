import { UserRepository } from "../repositories/UserRepository";
import { NotAuthorizedException } from "../exceptions/NotAuthorizedException";
import { WishlistCollectionRepository } from "../repositories/WishlistCollectionRepository";
import { Request } from "express";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import BCryptAdapter from "../adapters/BCryptAdapter";
import UserValidator from "../validators/UserValidator";
import JWTTokenAdapter from "../adapters/JWTTokenAdapter";

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private wishlistCollectionRepository: WishlistCollectionRepository
  ) {}

  async login(request: Request) {
    if (!request.body) {
      throw new BadRequestException("Dados inválidos.");
    }

    const { email, password } = request.body;
    try {
      UserValidator.checkLogin(request.body);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }

    const user = await this.userRepository.getUserInfoByEmail(email);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    if (!(await BCryptAdapter.checkIfMatch(password, user.password))) {
      throw new NotAuthorizedException("Senha inválida.");
    }

    const token = JWTTokenAdapter.generateToken(user.id);

    return {
      email,
      id: user.id,
      username: user.get("username"),
      funds: user.funds,
      token: token,
    };
  }

  async register(request: Request) {
    if (!request.body) {
      throw new BadRequestException("Dados inválidos.");
    }

    const userData = request.body;
    try {
      UserValidator.checkRegistration(userData);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }

    const userExist = await this.userRepository.getUserInfoByEmail(
      userData.email
    );
    if (userExist) {
      throw new BadRequestException("Uma conta já foi criada com esse email.");
    }

    const hashedPassword = await BCryptAdapter.encrypt(userData.password);

    const newUser = {
      ...userData,
      password: hashedPassword,
    };

    await this.userRepository.createUser(newUser);
  }

  async updatePassword(request: Request) {
    if (!request.user || !request.body) {
      throw new BadRequestException("Dados inválidos.");
    }

    const user = await this.userRepository.getUserPrivateDetailsById(
      request.user.id
    );
    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    const { password, new_password } = request.body;
    try {
      UserValidator.checkPasswordChange(request.body);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }

    if (!(await BCryptAdapter.checkIfMatch(password, user.password))) {
      throw new NotAuthorizedException("Senha inválida.");
    }

    const hashedPassword = await BCryptAdapter.encrypt(new_password);

    await this.userRepository.findUserAndUpdateDetails(user.id as string, {
      password: hashedPassword,
    });
  }

  async updateEmail(request: Request) {
    if (!request.user || !request.body) {
      throw new BadRequestException("Dados inválidos.");
    }

    const user = await this.userRepository.getUserPrivateDetailsById(
      request.user.id
    );
    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    const { email } = request.body;
    try {
      UserValidator.checkEmailChange(request.body);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }

    const userWithEmail = await this.userRepository.getUserInfoByEmail(email);
    if (userWithEmail) {
      throw new BadRequestException("Email já está sendo usado.");
    }

    await this.userRepository.findUserAndUpdateDetails(user.id as string, {
      email,
    });
  }

  async getInfo(request: Request) {
    if (!request.body || !request.params) {
      throw new BadRequestException("Dados inválidos.");
    }

    const { id } = request.params;
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException("Usuario não encontrado");
    }

    return user;
  }

  async getProducts(request: Request) {
    if (!request.body || !request.params) {
      throw new BadRequestException("Dados inválidos.");
    }

    const { id } = request.params;
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    return await this.userRepository.getUserProducts(user.id as string);
  }

  async getPrivateInfo(request: Request) {
    if (!request.user || !request.params) {
      throw new BadRequestException("Dados inválidos.");
    }

    const { id } = request.params;
    const user = await this.userRepository.getUserEmailAndFundsById(id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    if (user.id && user.id !== id) {
      throw new NotAuthorizedException("Não autorizado.");
    }

    return { id: user.id, funds: user.funds, email: user.email };
  }

  async addFunds(request: Request) {
    if (!request.body || !request.user) {
      throw new BadRequestException("Dados inválidos.");
    }

    const { amount } = request.body;
    if (amount < 0) {
      throw new BadRequestException("Valor inválido.");
    }

    const userExist = await this.userRepository.getUserById(request.user.id);
    if (!userExist) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    await this.userRepository.addUserFunds(userExist.id as string, amount);
  }

  async deleteAccount(request: Request) {
    if (!request.params || !request.user) {
      throw new BadRequestException("Dados inválidos.");
    }

    const { id } = request.params;
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    if (user.id !== id) {
      throw new NotAuthorizedException("Não autorizado.");
    }

    await this.userRepository.deleteUserAccount(id);
  }

  async updateInfo(request: Request) {
    if (!request.user || !request.body || !request.params) {
      throw new BadRequestException("Dados inválidos.");
    }

    const updatedUserData = request.body;
    try {
      UserValidator.checkCreate(updatedUserData);
    } catch (e: any) {
      throw new BadRequestException(e.message);
    }

    const { id } = request.params;
    const userExist = await this.userRepository.getUserById(id);
    if (!userExist) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    await this.userRepository.findUserAndUpdateDetails(id, updatedUserData);
  }

  async getEveryCollections(request: Request) {
    const { id } = request.params;

    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    return await this.wishlistCollectionRepository.getEveryCollectionsByUserId(
      user.id as string
    );
  }

  async getPublicCollections(request: Request) {
    const { id } = request.params;

    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new NotFoundException("Usuário não encontrado.");
    }

    return await this.wishlistCollectionRepository.getPublicCollectionsByUserId(
      user.id as string
    );
  }
}
