import { Controller } from '@nestjs/common';
import { SurpriseBagService } from './surprise-bag.service';

@Controller('surprise-bag')
export class SurpriseBagController {
  constructor(private readonly surpriseBagService: SurpriseBagService) {}
}
