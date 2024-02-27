import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module';
import { DadoLateralComponent } from './pages/dadoLateral/dadoLateral.component';



@NgModule({
  declarations: [
    DadoLateralComponent,

  ],
  imports: [
    CommonModule,
    MaterialModule,
  ],
  exports: [
    DadoLateralComponent
  ]
})
export class SharedModule { }
