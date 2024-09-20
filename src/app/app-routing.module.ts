import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import routeConfig from './app.routes';

@NgModule({
  imports: [RouterModule.forRoot(routeConfig)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
