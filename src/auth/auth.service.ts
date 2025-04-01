import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {CustomerService} from '../customer/customer.service';
import {PrismaService} from '../prisma.service';
import {AuthDto} from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(private jwt: JwtService, private customerService: CustomerService, private prisma: PrismaService) {
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
}
