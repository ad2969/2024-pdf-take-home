import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { appRoutes } from './app.routes'

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StockAnalysisComponent } from './stock/analysis.component';
import { SearchBarComponent } from './nav/search-bar/search-bar.component';

@NgModule ({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: true }, // <-- debugging purposes only
        ),
    ],
    declarations: [
        AppComponent,
        DashboardComponent,
        StockAnalysisComponent,
        SearchBarComponent,
    ],
    bootstrap: [AppComponent],
})

export class AppModule {}