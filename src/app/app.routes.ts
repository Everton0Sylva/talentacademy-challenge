import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./home/home.routes').then(m => m.routes),

    },
   /* {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    },*/
];
