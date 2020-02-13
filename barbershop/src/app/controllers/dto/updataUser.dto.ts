import UserDTO from "./user.dto";
import { IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export default class UpdateUserDTO extends UserDTO {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsNumber()
  @IsOptional()
  avatarId: number;
}
