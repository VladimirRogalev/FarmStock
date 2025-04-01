import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {CustomerModule} from '../customer/customer.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {getJwtConfig} from '../config/jwt.config';
import {PrismaService} from '../prisma.service';
import {CustomerService} from '../customer/customer.service';
import {JwtStrategy} from './strategies/jwt.strategy';
import {GoogleStrategy} from './strategies/google.strategy';

@Module({
    imports: [
        CustomerModule, ConfigModule, JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getJwtConfig
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, PrismaService, CustomerService, JwtStrategy, GoogleStrategy],
})
export class AuthModule {
}


