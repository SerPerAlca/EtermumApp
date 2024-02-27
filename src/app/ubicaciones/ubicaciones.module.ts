import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UbicacionesCiudadComponent } from './pages/ubicaciones-ciudad/ubicaciones-ciudad.component';



@NgModule({
  declarations: [
    UbicacionesCiudadComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AppRoutingModule,
    SharedModule,
  ]
})
export class UbicacionesModule { }
