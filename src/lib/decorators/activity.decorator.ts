import { SetMetadata } from '@nestjs/common';

export const ACTIVITY_KEY = 'activity';

export interface ActivityOptions {
  action: string;
  module: string;
}

export const Activity = (options: ActivityOptions) => SetMetadata(ACTIVITY_KEY, options);
