import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { appRoutes } from './app.routes'

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StockAnalysisComponent } from './stock/analysis.component';

@NgModule ({
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: true }, // <-- debugging purposes only
        )
        
    ],
    declarations: [
        AppComponent,
        DashboardComponent,
        StockAnalysisComponent,
    ],
    bootstrap: [AppComponent]
})

export class AppModule {}