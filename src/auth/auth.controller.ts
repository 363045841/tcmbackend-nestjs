import { Body, Controller, Get, Param, Post, Req, Res, UnauthorizedException, UseGuards, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FastifyRequest, FastifyReply } from 'fastify';
import { JwtAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: any,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ) {
    console.log(loginDto);
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    console.log(`user: ${user}`);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    // console.log("flat:", await this.authService.login(user, req, res));
    return res.send(await this.authService.login(user, req, res))
  }


  @Get('profile/:id')
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @Param('id') id: number,
    @Headers('Authorization') token: string,
  ) {
    return this.authService.getUserById(id);
  }
}