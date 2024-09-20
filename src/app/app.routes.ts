import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routeConfig: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Telesport',
    },
    {
        path: '**', // wildcard
        component: NotFoundComponent,
      },
];
export default routeConfig;