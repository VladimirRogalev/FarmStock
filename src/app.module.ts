import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';


@Module({
    imports: [
        ConfigModule.forRoot(),
        AuthModule,
        CustomerModule
    ],

})
export class AppModule {
}
