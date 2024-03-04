import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { AppRoutingModule } from '../app-routing.module';
import { UbicacionesCiudadComponent } from './pages/ubicaciones-ciudad/ubicaciones-ciudad.component';
import { UbicacionesRegionComponent } from './pages/ubicaciones-region/ubicaciones-region.component';
import { SharedModule } from '../shared/shared.module';
import { DialogEntrarRegionalComponent } from './components/dialog-entrar-regional/dialog-entrar-regional.component';
import { DialogDescansarRegionalComponent } from './components/dialog-descansar-regional/dialog-descansar-regional.component';



@NgModule({
  declarations: [
    UbicacionesCiudadComponent,
    UbicacionesRegionComponent,
    DialogEntrarRegionalComponent,
    DialogDescansarRegionalComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AppRoutingModule,
    SharedModule,
  ]
})
export class UbicacionesModule { }
