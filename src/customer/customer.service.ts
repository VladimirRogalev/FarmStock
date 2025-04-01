import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma.service';
import {hash} from 'argon2';
import {AuthDto} from '../auth/dto/auth.dto';

@Injectable()
export class CustomerService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getById(id: string) {
        const customer = await this.prisma.customer.findUnique({where: {id}});
        return customer;
    }

    async getByEmail(email: string) {
        const customer = await this.prisma.customer.findUnique({where: {email}});
        return customer;
    }

    async create(dto: AuthDto) {
        return this.prisma.customer.create({
            data: {
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: dto.email,
                phoneNumber: dto.phoneNumber,
                password: await hash(dto.password)

            }
        });
    }
}

