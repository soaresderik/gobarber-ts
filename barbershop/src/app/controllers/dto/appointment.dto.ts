import { IsInt, IsDate, IsDateString } from "class-validator";

export class CreateAppoitmentDTO {
  @IsInt()
  providerId: number;

  @IsDateString()
  date: Date;
}
