import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Redirect,
    Request,
    UseGuards,
  } from '@nestjs/common';

@Controller('title')
export class TitleController {

    constructor(
        // private readonly authService: AuthService,
      ) {}
    
    
      // @ApiVersion()
      // @ApiTags('auth')
      // // @UseGuards(LocalAuthGuard)
      // @Post('auth/login')
      // async login(
      //   @Body() { deviceId, nutakuId, date }: LoginDto,
      // ): Promise<LoginResponseDto> {
      //   return this.authService.loginWithDeviceId(deviceId, nutakuId, date);
      // }

//     @Get('me')
//   getProfile(@Request() req): Promise<GetProfileResponseDto> {
//     return this.userService.getById(req.user.id);
//   }

}
