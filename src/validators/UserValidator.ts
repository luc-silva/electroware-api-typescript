class UserValidator {
  private emailRegex = /.*@\w*.\.com/g;
  private DESCRIPTION_LENGTH = 250;

  public checkCreate(request_body: UserDTO) {
    this.validateName(request_body.name);
    this.validateDescription(request_body.description);
  }

  public checkLogin(request_body: UserDTO) {
    this.validateEmail(request_body.email);
    this.validatePassword(request_body.password);
  }

  public checkPasswordChange(request_body: UserDTO) {
    this.validatePassword(request_body.new_password);
  }

  public checkEmailChange(request_body: UserDTO) {
    this.validateEmail(request_body.email);
  }

  public checkRegistration(request_body: UserDTO) {
    this.validateEmail(request_body.email);
    this.validatePassword(request_body.password);
    this.validateName(request_body.name);
    this.validateLocation(request_body.location);
    this.validateDescription(request_body.description);
  }

  private validateEmail(email: string) {
    if (!email || !email.match(this.emailRegex)) {
      throw new Error("Campo email inválido.");
    }
  }

  private validatePassword(password: string) {
    if (!password || password.length < 8) {
      throw new Error("Campo senha inválido.");
    }
  }

  private validateName(name: { first: string; last: string }) {
    if (!name || !name.first) {
      throw new Error("Campo nome inválido.");
    }
    if (name.first.length > 10 || name.last.length > 10) {
      throw new Error("Campo sobrenome inválido.");
    }
  }

  private validateDescription(description: string) {
    if (description && description.length > this.DESCRIPTION_LENGTH) {
      throw new Error("Campo descrição inválido.");
    }
  }

  private validateLocation(location: { country: string; state: string }) {
    if (!location.country) {
      throw new Error("Campo país inválido.");
    }
    if (!location.state) {
      throw new Error("Campo estado inválido.");
    }
  }
}

export default new UserValidator();
