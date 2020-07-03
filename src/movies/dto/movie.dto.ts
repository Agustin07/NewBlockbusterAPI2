import {
  IsString,
  IsNotEmpty,
  IsNumberString,
  IsUrl,
  IsBoolean,
  IsIn,
  IsOptional,
} from 'class-validator';


export class CreateMovieDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUrl()
  poster: string;

  @IsNotEmpty()
  @IsNumberString()
  stock: number;

  @IsNotEmpty()
  @IsUrl()
  trailer: string;

  @IsNotEmpty()
  @IsNumberString()
  price: number;

  @IsNotEmpty()
  @IsBoolean()
  availability: boolean;
}

export class UpdateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUrl()
  poster: string;

  @IsNotEmpty()
  @IsNumberString()
  stock: number;

  @IsNotEmpty()
  @IsUrl()
  trailer: string;

  @IsNotEmpty()
  @IsNumberString()
  price: number;

  @IsNotEmpty()
  @IsBoolean()
  availability: boolean;
}

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}


export class QueryMoviesDto {
  @IsOptional()
  @IsString()
  @IsIn(['title', 'likes'])
  sortedBy: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsIn(['true', 'false'])
  availability: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  tags: string;

}