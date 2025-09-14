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
    // Find place for check somethings like is place exist or is place already reserved or not
    const placeInfo = await this.placeRepository.findOne({
      where: { id: placeId },
    });

    if (!placeInfo) throw new NotFoundException('Place not found');

    if (placeInfo.isReserved)
      throw new ConflictException('Place already reserved');

    // Find user for check somethings like is user exist or is user already reserved any place or not
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

    //  Find place
    const findPlaceForCancelReservation = await this.placeRepository.findOne({
      where: { id: findReservation.place.id },
    });

    if (!findPlaceForCancelReservation)
      throw new NotFoundException('Place not found');

    // Set isReserved column to false which is means this place not reserved
    await this.placeRepository.update(findPlaceForCancelReservation.id, {
      isReserved: false,
    });

    // Find user
    const findUserForCancelReservation = await this.userRepository.findOne({
      where: { id: findReservation.user.id },
    });
    if (!findUserForCancelReservation)
      throw new NotFoundException('User not found');

    // Set isReserved column to false which is means user doesn't reserved any place
    await this.userRepository.update(findUserForCancelReservation.id, {
      isReserved: false,
    });

    // Pay back money (money payback into user's wallet)
    const placePrice = findPlaceForCancelReservation.price;
    const penalty = Math.floor(placePrice * 0.8);

    // Find user's wallet
    const userWallet = await this.walletRepository.findOne({
      where: {
        user: { id: findUserForCancelReservation.id },
      },
    });

    if (!userWallet)
      throw new NotFoundException('Wallet not found. It is internal err');

    // Update amount column
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

    //  Find place to reserve
    const findPlace = await this.placeRepository.findOne({
      where: {
        id: placeId,
      },
    });

    if (!findPlace) throw new NotFoundException('place not found');

    if (findPlace.isReserved)
      throw new ConflictException('place already registered');

    // Find user that want reserve a place
    const findUser = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!findUser) throw new NotFoundException('user not found');

    if (findUser.isReserved)
      throw new ConflictException('user already reserved');

    // Store wallet balance that user had it
    const walletBalance = findUserWallet.amount;
    // Store place price
    const placePrice = findPlace.price;

    if (placePrice > walletBalance) {
      throw new HttpException(
        'Please charge wallet',
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    // Update columns to true which is means place reserved and user reserved a place
    findPlace.isReserved = true;
    findUser.isReserved = true;
    // Update amount of wallet
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
