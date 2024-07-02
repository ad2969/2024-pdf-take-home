import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StockAnalysisComponent } from './stock/analysis.component';

export const appRoutes: Route[] = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'stock/:id', component: StockAnalysisComponent },
    { path: 'account/preferences', component: DashboardComponent },
];
