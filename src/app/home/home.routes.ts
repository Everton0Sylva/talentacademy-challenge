import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./home.component').then(m => m.HomeComponent),
        children: [
            {
                path: 'give',
                loadComponent: () => import('./component/give-consent/give-consent.component').then(m => m.GiveConsentComponent)
            },
            {
                path: 'collected',
                loadComponent: () => import('./component/collected-consents/collected-consents.component').then(m => m.CollectedConsentsComponent)
            },
        ]
    },
    {
        path: "",
        redirectTo: "",
        pathMatch: "full",
    },
];
