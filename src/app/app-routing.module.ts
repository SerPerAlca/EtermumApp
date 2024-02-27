import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibroPageComponent } from './historia/pages/libro-page/libro-page.component';
import { LayoutComponent } from './historia/pages/layout/layout.component';
import { UbicacionesCiudadComponent } from './ubicaciones/pages/ubicaciones-ciudad/ubicaciones-ciudad.component';

const routes: Routes = [
  {
    path:'',
    redirectTo: 'layout',
    pathMatch: 'full'
  },
  {
    path: 'historia', component: LibroPageComponent
  },
  {
    path:'layout', component: LayoutComponent
  },
  {
    path:'ubicaciones-ciudad/:id', component: UbicacionesCiudadComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
