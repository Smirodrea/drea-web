import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';

if (environment.production) {
  enableProdMode();

  // Disable console.log
  console.log = function () {};

  // Optionally, disable other console functions in production
  console.warn = function () {};
  console.error = function () {};
  console.info = function () {};
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
