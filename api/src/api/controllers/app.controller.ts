import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@Controller()
@ApiTags('Default')
export class AppController {
    @Get('healthy')
    @ApiOperation({ summary: '헬스 체크' })
    getHello() {
        return { message: 'OK' };
    }
}