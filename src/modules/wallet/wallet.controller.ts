import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { WalletService } from './wallet.service';
import { WalletAmountDto } from './dto/wallet-amount.dto';

@Controller(`v${process.env.VERSION}/wallet`)
@UseGuards(AuthGuard('jwt-access'))
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Patch('/increase')
  increase(
    @Req() req,
    @Body() walletAmountDto: WalletAmountDto,
  ): Promise<void> {
    const userId = req.user.id;
    return this.walletService.increase(userId, walletAmountDto);
  }

  @Patch('/decrease')
  decrease(
    @Req() req,
    @Body() walletAmountDto: WalletAmountDto,
  ): Promise<void> {
    const userId = req.user.id;
    return this.walletService.decrease(userId, walletAmountDto);
  }
}
