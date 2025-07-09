import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import path = require("path");

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  /* app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.flatMap((err) =>
          Object.values(err.constraints || {})
        );
        return new BadRequestException(messages);
      },
    })
  );
  */
  // for you ya Assem
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle("ITI")
    .setVersion("1.0")
    .addTag("Alex")
    .addBearerAuth()
    .build();
  app.useStaticAssets(path.join(__dirname, "..", "output"), {
    prefix: "/output/",
  });
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
