import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInRequest, TokenResponse } from 'src/data/Data';
import { User } from 'src/entity/user/user.entity';
import { UserRepository } from 'src/entity/user/user.repository';
import { InvalidTokenException } from 'src/error/exceptions/exception.invalid-token';
import { LoginFailedExceotion } from 'src/error/exceptions/exception.login-failed';
import { compare } from 'src/utils/password.encoder';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getToken(signInRequest: SignInRequest): Promise<TokenResponse> {
    const user = await this.userRepository.findOne({ id: signInRequest.id });

    if (!user || (user && compare(user.password, signInRequest.password))) {
      throw new LoginFailedExceotion();
    }

    const refreshToken = this.jwtService.sign(
      { userId: user.userSeq },
      { expiresIn: 2678400 * 1000 },
    );

    await this.cacheManager.set(refreshToken, user.userSeq, {
      ttl: 2678400 * 1000,
    });

    return {
      accessToken: this.jwtService.sign(
        { userId: user.userSeq },
        { expiresIn: 3600 * 1000 },
      ),
      refreshToken: refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    const verifyToken = refreshToken.substring(7);
    const userSeq = await this.cacheManager.get(verifyToken);
    console.log(userSeq);

    const newRefreshToken = this.jwtService.sign(
      { userId: userSeq },
      { expiresIn: 2678400 * 1000 },
    );

    this.cacheManager.del(verifyToken);
    this.cacheManager.set(newRefreshToken, userSeq, { ttl: 2678400 * 1000 });

    return {
      accessToken: this.jwtService.sign(
        { userId: userSeq },
        { expiresIn: 3600 * 1000 },
      ),
      refreshToken: newRefreshToken,
    };
  }
}
