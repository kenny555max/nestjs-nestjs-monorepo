export type JwtPayload = {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: number;
};

export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };

export type Tokens = {
    accessToken: string;
    refreshToken: string;
};
