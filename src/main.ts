import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app=await NestFactory.create(AppModule);
  // Enable CORS for all origins (adjust options as needed)
  app.enableCors();

  const config=new DocumentBuilder()
    .setTitle('FitRescue API')
    .setDescription('FitRescue backend API documentation')
    .setVersion('1.0')
    .build();

  // Limit Swagger scanning to the AppModule to avoid scanning modules
  // that may not have their route metadata populated in some runtime configs.
  let document;
  try {
    document=SwaggerModule.createDocument(app, config, { include: [AppModule] });
  } catch (err) {
    // If Swagger scanning fails (some modules may expose unexpected metadata),
    // fall back to a minimal OpenAPI document so the UI still loads.
    console.warn('Swagger createDocument failed, falling back to minimal document:', err?.message||err);
    try {
      // Dump module metadata to help diagnose which module is missing route maps
      const modules=(app as any).container.getModules();
      console.warn('Registered modules:');
      modules.forEach((moduleRef: any, moduleKey: any) => {
        const name=moduleKey?.name??moduleKey;
        const hasRoutes=!!moduleRef.routes;
        const controllers=moduleRef.controllers? Array.from(moduleRef.controllers.keys()).map((c: any) => c.name||c):[];
        console.warn(` - ${name} | hasRoutes: ${hasRoutes} | controllers: ${controllers.join(', ')}`);
      });
    } catch (dumpErr) {
      console.warn('Failed to dump module metadata for diagnosis:', dumpErr?.message||dumpErr);
    }
    document={
      openapi: '3.0.0',
      info: {
        title: 'FitRescue API',
        version: '1.0',
        description: 'Fallback API documentation (scanner failed)'
      },
      paths: {},
      components: {}
    } as any;
  }

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT??3000);
}

bootstrap();
