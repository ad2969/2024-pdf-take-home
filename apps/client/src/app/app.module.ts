import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { appRoutes } from './app.routes'

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StockAnalysisComponent } from './stock/analysis.component';
import { SearchBarComponent } from './nav/search-bar/search-bar.component';
import { TradeService } from './api/trade.service';

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
    providers: [TradeService],
    bootstrap: [AppComponent],
})

export class AppModule {}