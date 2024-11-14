import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LayoutSquaresComponent } from './layout-squares/layout-squares.component';
// import { SignalrComponent } from './layout-squares/components/signalr/signalr.component';
// import { SquareComponent } from './square/square.component';

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    LayoutSquaresComponent
    // SquareComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
