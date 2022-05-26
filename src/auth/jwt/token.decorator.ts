import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

export const Token = createParamDecorator((data, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    console.log(request.user);
    return request.user;
})
