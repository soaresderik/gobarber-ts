import BaseHttpService from "./base-http.service";
import { IAuthenticate, AuthResponse } from "./interfaces";
import { ISignUp, IUpdateUser } from "../store/interfaces";

class AuthService extends BaseHttpService {
  async signIn(data: IAuthenticate): Promise<any> {
    return this.post("sessions", data);
  }

  async signUp(data: ISignUp): Promise<any> {
    return this.post("users", data);
  }

  async updateUser(data: IUpdateUser) {
    return this.put("sessions", data);
  }
}

export default new AuthService();
