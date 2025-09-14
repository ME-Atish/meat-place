import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Wallet } from './wallet.entity';
import { WalletAmountDto } from './dto/wallet-amount.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async increase(
    userId: string,
    walletAmountDto: WalletAmountDto,
  ): Promise<void> {
    const { amount } = walletAmountDto;

    const findUserWallet = await this.walletRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!findUserWallet) throw new NotFoundException('wallet not found');

    await this.walletRepository.update(findUserWallet.id, {
      amount: findUserWallet.amount + amount,
    });

    return;
  }

  async decrease(
    userId: string,
    walletAmountDto: WalletAmountDto,
  ): Promise<void> {
    const { amount } = walletAmountDto;

    const findWallet = await this.walletRepository.findOne({
      where: {
        user: { id: userId },
      },
    });

    if (!findWallet) throw new NotFoundException('Wallet not found');

    if (findWallet.amount < amount)
      throw new NotAcceptableException(
        'The amount to be deducted is less than the account balance.',
      );

    const deductedAmount = findWallet.amount - amount;

    await this.walletRepository.update(findWallet.id, {
      amount: deductedAmount,
    });

    return;
  }
}
