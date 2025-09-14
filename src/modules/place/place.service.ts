import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Place } from './place.entity';
import { CreatePlaceDto } from 'src/modules/place/dto/create-place.dto';
import { User } from 'src/modules/auth/user.entity';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAll(): Promise<Place[]> {
    const places = await this.placeRepository.find();
    return places;
  }

  async getOne(id: string): Promise<Place> {
    const place = await this.placeRepository.findOne({ where: { id } });
    if (!place) throw new NotFoundException('place not found');

    return place;
  }

  async create(
    createPlaceDto: CreatePlaceDto,
    id: string,
    originalname: string,
  ): Promise<void> {
    const { name, address, description, facilities, price, province, city } =
      createPlaceDto;

    const createPlace = this.placeRepository.create({
      name,
      address,
      description,
      facilities,
      price,
      province,
      city,
      image: originalname,
    });

    const user = await this.userRepository.findOne({ where: { id } });
    if (!user)
      throw new NotFoundException('user not found, please check access token');

    await this.userRepository.update(user.id, { isOwner: true });

    createPlace.owner = user;

    await this.placeRepository.save(createPlace);

    return;
  }

  async remove(userId: string, placeId: string): Promise<void> {
    const findPlaceToRemove = await this.placeRepository.findOne({
      where: {
        id: placeId,
        owner: { id: userId },
      },
    });

    if (!findPlaceToRemove) throw new NotFoundException();

    await this.placeRepository.delete(placeId);
    return;
  }

  async update(
    userId: string,
    placeId: string,
    createPlaceDto: CreatePlaceDto,
    originalname,
  ): Promise<void> {
    const { name, address, description, facilities, price, province, city } =
      createPlaceDto;

    const findPlaceToUpdate = await this.placeRepository.findOne({
      where: {
        id: placeId,
        owner: { id: userId },
      },
    });

    if (!findPlaceToUpdate) throw new NotFoundException();

    const place = await this.placeRepository.update(placeId, {
      name,
      address,
      description,
      facilities,
      price,
      province,
      city,
      image: originalname,
    });

    if (place.affected === 0) throw new NotFoundException();

    return;
  }

  async getOwnerPlaces(userId: string): Promise<Place[]> {
    const findUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!findUser)
      throw new NotFoundException('user not found. check access token');

    const places = await this.placeRepository.find({
      where: {
        owner: { id: findUser.id },
      },
    });

    return places;
  }

  async getOneOwnerPlace(userId: string, placeId: string): Promise<Place> {
    const findUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!findUser)
      throw new NotFoundException('user not found. check access token');

    const place = await this.placeRepository.findOne({
      where: {
        owner: { id: findUser.id },
        id: placeId,
      },
    });

    if (!place) throw new NotFoundException('Place not found');

    return place;
  }
}
