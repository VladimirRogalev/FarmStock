import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { OrderModule } from './order/order.module';
import { FarmModule } from './farm/farm.module';


@Module({
    imports: [
        ConfigModule.forRoot(),
        AuthModule,
        UserModule,
        OrderModule,
        FarmModule
    ],

})
export class AppModule {
}
