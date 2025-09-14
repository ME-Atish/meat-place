import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ReserveService } from './reserve.service';
import { Reserve } from './reserve.entity';

@Controller(`v${process.env.VERSION}/reserve`)
@UseGuards(AuthGuard('jwt-access'))
export class ReserveController {
  constructor(private readonly reserveService: ReserveService) {}

  @Get()
  getAll(): Promise<Reserve[]> {
    return this.reserveService.getAll();
  }

  @Get('/:id')
  getOne(@Param('id', ParseUUIDPipe) id: string): Promise<Reserve> {
    return this.reserveService.getOne(id);
  }

  @Delete('/cancel/:id')
  cancelReservation(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.reserveService.cancelReservation(id);
  }

  @Post('/:placeId')
  reservePlace(
    @Req() req,
    @Param('placeId', ParseUUIDPipe) placeId: string,
  ): Promise<void> {
    const userId = req.user.id;
    return this.reserveService.reservePlace(placeId, userId);
  }

  @Post('/via-wallet/:id')
  reservePlaceViaWallet(
    @Req() req,
    @Param('id') placeId: string,
  ): Promise<void> {
    const userId = req.user.id;
    return this.reserveService.reservePlaceViaWallet(userId, placeId);
  }
}
