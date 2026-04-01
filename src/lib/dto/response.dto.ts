import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Operation completed successfully.' })
  message: string;

  @ApiProperty({ required: false })
  data?: any;
}

export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'Invalid request data.' })
  message: string;

  @ApiProperty({ required: false, example: 'null' })
  data: any;
}
