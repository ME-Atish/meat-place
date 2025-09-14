import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user.entity';
import { Wallet } from 'src/modules/wallet/wallet.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `http://localhost:${process.env.PORT}/v${process.env.VERSION}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const email = profile.emails[0].value;

    const user = await this.userRepository.findOne({ where: { email } });
    if (user) return done(null, user);

    const firstName = profile.name?.givenName;
    const lastName = profile.name?.familyName || `${firstName}Family`;
    const username =
      // eslint-disable-next-line no-useless-escape
      `${firstName} ${lastName}`.replace(/[\.-]/, '') +
      Math.floor(1000 + Math.random() * 9000);

    const newUser = this.userRepository.create({
      username,
      firstName,
      lastName,
      email,
    });
    const savedUser = await this.userRepository.save(newUser);

    const wallet = this.walletRepository.create({ user: savedUser });
    await this.walletRepository.save(wallet);

    return done(null, savedUser);
  }
}
