import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Profile, Strategy, VerifyCallback} from 'passport-google-oauth20';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private configService: ConfigService) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID')!,
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET')!,
            callbackURL: configService.get<string>('SERVER_URL') + '/auth/google/callback',
            scope: ['profile', 'email']
        });
    }

    async validate(_accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) {
        const {emails, name} = profile;

        if (emails) {
            const user = {
                email: emails[0].value,
                firstName: name?.givenName || '',
                lastName: name?.familyName || ''
            };
            done(null, user);
        }

    }
}