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
import { TitleService } from './title.service';

@Controller('title')
export class TitleController {

    constructor(
        private readonly titleService: TitleService,
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

    @Get('me')
    getTitles() { //: Promise<GetProfileResponseDto>
        return this.titleService.getTitles();
    }

}
