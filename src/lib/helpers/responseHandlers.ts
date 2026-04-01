import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

interface HandlerProps {
  condition: boolean;
  message: string;
}

export const BadRequestHandler = (props: HandlerProps) => {
  if (props.condition) {
    throw new BadRequestException(props.message);
  }
};

export const NotFoundHandler = (props: HandlerProps) => {
  if (props.condition) {
    throw new NotFoundException(props.message);
  }
};

export const UnauthorizedHandler = (props: HandlerProps) => {
  if (props.condition) {
    throw new UnauthorizedException(props.message);
  }
};

export const ForbiddenHandler = (props: HandlerProps) => {
  if (props.condition) {
    throw new ForbiddenException(props.message);
  }
};
