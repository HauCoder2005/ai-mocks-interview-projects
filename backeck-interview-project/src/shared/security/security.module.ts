import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
    imports: [JwtModule.register({})],
    providers: [JwtService],
    exports: [JwtService],
})
export default class SecurityModule {}