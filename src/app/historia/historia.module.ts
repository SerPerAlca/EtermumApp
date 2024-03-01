import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibroPageComponent } from './pages/libro-page/libro-page.component';
import { MaterialModule } from '../material/material.module';
import { LayoutComponent } from '../shared/pages/layout/layout.component';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    LibroPageComponent,
    LayoutComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AppRoutingModule,
    SharedModule,
  ]
})
export class HistoriaModule { }
