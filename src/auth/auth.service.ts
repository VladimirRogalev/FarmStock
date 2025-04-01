import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {CustomerService} from '../customer/customer.service';
import {PrismaService} from '../prisma.service';
import {AuthDto} from './dto/auth.dto';
import {Response} from 'express';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class AuthService {
    EXPIRE_DAY_REFRESH_TOKEN = 1;
    REFRESH_TOKEN_NAME = 'refreshToken';

    constructor(private jwt: JwtService,
                private customerService: CustomerService,
                private prisma: PrismaService,
                private configService: ConfigService) {
    }

    async login(dto: AuthDto) {
        const customer = await this.validateCustomer(dto);
        const tokens = this.issueTokens(customer.id);
        return {customer, ...tokens};
    }

    async register(dto: AuthDto) {
        const oldCustomer = await this.customerService.getByEmail(dto.email);

        if (oldCustomer) {
            throw new BadRequestException('Customer is already exist');
        }
        const customer = await this.customerService.create(dto);
        const tokens = this.issueTokens(customer.id);
        return {customer, ...tokens};
    }

    async getNewTokens(refreshToken: string) {
        const result = await this.jwt.verifyAsync(refreshToken);
        if (!result) {
            throw new UnauthorizedException('Refresh token in not a valid');
        }
        const customer = await this.customerService.getById(result.id);
        if (!customer) {
            throw new UnauthorizedException('Customer not found');
        }
        const tokens = this.issueTokens(customer.id);
        return {customer, ...tokens};

    }

    issueTokens(customerId: string) {
        const data = {id: customerId};
        const accessToken = this.jwt.sign(data, {
            expiresIn: '1h'
        });
        const refreshToken = this.jwt.sign(data, {
            expiresIn: '7d'
        });
        return {accessToken, refreshToken};
    }

    private async validateCustomer(dto: AuthDto) {
        const customer = await this.customerService.getByEmail(dto.email);
        if (!customer) {
            throw new NotFoundException('Customer not found');
        }
        return customer;
    }

    async validateOAuthLogin(req: any) {
        let customer = await this.customerService.getByEmail(req.customer.email);

        if (!customer) {
            customer = await this.prisma.customer.create({
                data: {
                    email: req.customer.email,
                    firstName: req.customer.givenName,
                    lastName: req.customer.familyName
                }
            });
        }
        const tokens = this.issueTokens(customer.id);
        return {customer, ...tokens};
    }

    addRefreshTokenToResponse(res: Response, refreshToken: string) {
        const expiresIn = new Date();
        expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN);
        res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
            httpOnly: true,
            domain: this.configService.get('SERVER_DOMAIN'),
            expires: expiresIn,
            secure: true,
            sameSite: 'none'
        });
    }

    removeRefreshTokenFromResponse(res: Response) {
        res.cookie(this.REFRESH_TOKEN_NAME, '', {
            httpOnly: true,
            domain: this.configService.get('SERVER_DOMAIN'),
            expires: new Date(0),
            secure: true,
            sameSite: 'none'
        });
    }
}
