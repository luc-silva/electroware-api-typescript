import { Module } from "@nestjs/common";
import { ServiceModule } from "./services/Services.module";
import { RepositoryModule } from "./repositories/Repository.module";
import { ControllerModule } from "./controllers/Controllers.module";

@Module({
  imports: [ServiceModule, RepositoryModule, ControllerModule],
})
export class ServerModule {}
