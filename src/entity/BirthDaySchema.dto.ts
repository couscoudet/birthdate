import {
  IsDate,
  IsEmpty,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from "class-validator";

export default class BirthDaySchema {
  constructor() {}

  @IsInt()
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  name: string;

  @IsInt()
  @Min(1)
  @Max(31)
  @IsNotEmpty()
  day: number;

  @IsInt()
  @Min(1)
  @Max(12)
  @IsNotEmpty()
  month: number;

  @IsDate()
  @IsOptional()
  created_at?: Date;

  @IsDate()
  @IsOptional()
  updated_at?: Date;

  hydrate({ id, name, day, month, created_at, updated_at }) {
    this.id = id;
    this.name = name;
    this.day = day;
    this.month = month;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
