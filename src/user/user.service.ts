import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma.service';
import {hash} from 'argon2';
import {RegisterDto} from '../auth/dto/register.dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getById(id: string) {
        const user = await this.prisma.user.findUnique({where: {id}});
        return user;
    }

    async getByEmail(email: string) {
        const user = await this.prisma.user.findUnique({where: {email}});
        return user;
    }

    async create(dto: RegisterDto) {
        return this.prisma.user.create({
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

