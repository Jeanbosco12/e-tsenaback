import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsString,
  Length,
  Matches,
} from 'class-validator';
<<<<<<< HEAD

export class CreateUserDto {
=======
import { Transform } from 'class-transformer';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).+$/;

export class CreateUserDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

<<<<<<< HEAD
=======
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022
  @IsEmail()
  @Length(5, 150)
  email: string;

  @IsString()
  @MinLength(8)
<<<<<<< HEAD
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;
  
=======
  @Matches(PASSWORD_REGEX, {
    message: 'Password must contain at least one letter and one number',
  })
  password: string;
>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022
}

export class UpdateUserDto {
  @IsOptional()
<<<<<<< HEAD
  @IsString()
  @IsNotEmpty()
=======
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022
  @Length(2, 100)
  name?: string;

  @IsOptional()
<<<<<<< HEAD
=======
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022
  @IsEmail()
  @Length(5, 150)
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
<<<<<<< HEAD
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).+$/, {
    message: 'Password must contain at least one letter and one number',
  })
  password?: string;
}
=======
  @Matches(PASSWORD_REGEX, {
    message: 'Password must contain at least one letter and one number',
  })
  password?: string;
}
>>>>>>> 532c880be8cc427983f461d3acf08280dadd2022
