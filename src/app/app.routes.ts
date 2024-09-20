import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DetailComponent } from './pages/detail/detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routeConfig: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Telesport',
    },
    {
        path: 'detail/:country',
        component: DetailComponent,
        title: 'Detail',
    },
    {
        path: '**', // wildcard
        component: NotFoundComponent,
      },
];
export default routeConfig;