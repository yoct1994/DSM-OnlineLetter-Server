import { IsNotEmpty } from 'class-validator';

export class TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export class UserResponse {
  userSeq: number;
  username: string;
  userImage: string;
  longitude: number;
  latitude: number;
}

export class LetterResponse {
  chatList: string;
}

export class VerifyToken {
  userSeq: number;
}

export class SignInRequest {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  password: string;
}

export class SignUpRequest {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  longitude: number;

  @IsNotEmpty()
  latitude: number;
}

export class WriteLetterRequest {
  @IsNotEmpty()
  title: string;

  chatList: string;

  @IsNotEmpty()
  to: number;
}

export type Error = {
  status: number;
  message: string;
  timestamp: string;
};

type Area = {
  longitude: number;
  latitude: number;
};

export type Letter = {
  id: number;
  from: string;
  to: string;
  fromSeq: number;
  toSeq: number;
  isRead: boolean;
};

export type Sentence = {
  id: number;
  content: string;
  image: string;
  color: string;
  textType: string;
  alpha: string;
};
