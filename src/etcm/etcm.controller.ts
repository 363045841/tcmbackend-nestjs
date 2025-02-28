import { Controller, Get, Param } from '@nestjs/common';
import { EtcmService } from './etcm.service';

@Controller('etcm')
export class EtcmController {
    constructor(
        private readonly etcmService: EtcmService
    ) {}

    @Get(':name')
    async getByName(@Param('name') name: string) {
        return this.etcmService.getByName(name);
    }

    
}
