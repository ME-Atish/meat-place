import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Reserve } from './reserve.entity';
import { Place } from 'src/modules/place/place.entity';
import { User } from 'src/modules/auth/user.entity';
import { Wallet } from 'src/modules/wallet/wallet.entity';

@Injectable()
export class ReserveService {
  constructor(
    @InjectRepository(Reserve)
    private readonly reserveRepository: Repository<Reserve>,
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async getAll(): Promise<Reserve[]> {
    const reserves = await this.reserveRepository.find();
    return reserves;
  }

  async getOne(id: string): Promise<Reserve> {
    const reserve = await this.reserveRepository.findOne({ where: { id } });
    if (!reserve) throw new NotFoundException();
    return reserve;
  }

  async reservePlace(placeId: string, userId: string): Promise<void> {
    const placeInfo = await this.placeRepository.findOne({
      where: { id: placeId },
    });

    if (!placeInfo) throw new NotFoundException('Place not found');

    if (placeInfo.isReserved)
      throw new ConflictException('Place already reserved');

    const userInfo = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!userInfo) throw new NotFoundException('User not found');

    if (userInfo?.isReserved)
      throw new ConflictException('User already reserved place');

    const reserve = this.reserveRepository.create({
      place: placeInfo,
      user: userInfo,
    });

    await this.reserveRepository.save(reserve);

    await this.placeRepository.update(placeId, {
      isReserved: true,
    });

    await this.userRepository.update(userId, {
      isReserved: true,
    });

    return;
  }

  async cancelReservation(id: string): Promise<void> {
    const findReservation = await this.reserveRepository.findOne({
      where: { id },
    });

    if (!findReservation) throw new NotFoundException('Reservation not found');

    const findPlaceForCancelReservation = await this.placeRepository.findOne({
      where: { id: findReservation.place.id },
    });

    if (!findPlaceForCancelReservation)
      throw new NotFoundException('Place not found');

    await this.placeRepository.update(findPlaceForCancelReservation.id, {
      isReserved: false,
    });

    const findUserForCancelReservation = await this.userRepository.findOne({
      where: { id: findReservation.user.id },
    });
    if (!findUserForCancelReservation)
      throw new NotFoundException('User not found');

    await this.userRepository.update(findUserForCancelReservation.id, {
      isReserved: false,
    });

    const placePrice = findPlaceForCancelReservation.price;
    const penalty = Math.floor(placePrice * 0.8);

    const userWallet = await this.walletRepository.findOne({
      where: {
        user: { id: findUserForCancelReservation.id },
      },
    });
    console.log(userWallet);
    if (!userWallet)
      throw new NotFoundException('Wallet not found. It is internal err');

    userWallet.amount += penalty;
    await this.walletRepository.save(userWallet);
    await this.reserveRepository.remove(findReservation);

    return;
  }

  async reservePlaceViaWallet(userId: string, placeId: string): Promise<void> {
    const findUserWallet = await this.walletRepository.findOne({
      where: {
        user: { id: userId },
      },
    });

    if (!findUserWallet)
      throw new NotFoundException(
        'wallet not found. check registration process',
      );

    const findPlace = await this.placeRepository.findOne({
      where: {
        id: placeId,
      },
    });

    if (!findPlace) throw new NotFoundException('place not found');
    if (findPlace.isReserved)
      throw new ConflictException('place already registered');

    const findUser = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!findUser) throw new NotFoundException('user not found');
    if (findUser.isReserved)
      throw new ConflictException('user already reserved');

    const walletBalance = findUserWallet.amount;
    const placePrice = findPlace.price;

    if (placePrice > walletBalance) {
      throw new HttpException(
        'Please charge wallet',
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    findPlace.isReserved = true;
    findUser.isReserved = true;
    findUserWallet.amount -= placePrice;

    await this.placeRepository.save(findPlace);
    await this.userRepository.save(findUser);
    await this.walletRepository.save(findUserWallet);

    const reserve = this.reserveRepository.create({
      place: findPlace,
      user: findUser,
    });

    await this.reserveRepository.save(reserve);

    return;
  }
}
