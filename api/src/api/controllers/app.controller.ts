import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "../decorators";

@Public()
@Controller()
@ApiTags('애플리케이션')
export class AppController {
    @Get('healthy')
    @ApiOperation({ summary: '헬스 체크' })
    getHello() {
        return { message: 'OK' };
    }
}