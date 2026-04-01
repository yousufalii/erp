import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty({ example: true, description: 'Indicating the success status of the operation' })
  success: boolean;

  @ApiProperty({ example: 'Action completed successfully.', description: 'Descriptive message of the operation' })
  message: string;

  @ApiProperty({ required: false, description: 'The payload of the response' })
  data: any;
}
