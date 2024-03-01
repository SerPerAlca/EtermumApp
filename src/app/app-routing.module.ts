import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibroPageComponent } from './historia/pages/libro-page/libro-page.component';
import { LayoutComponent } from './shared/pages/layout/layout.component';
import { UbicacionesCiudadComponent } from './ubicaciones/pages/ubicaciones-ciudad/ubicaciones-ciudad.component';
import { UbicacionesRegionComponent } from './ubicaciones/pages/ubicaciones-region/ubicaciones-region.component';

const routes: Routes = [
  {
    path:'',
    redirectTo: 'layout',
    pathMatch: 'full'
  },
  {
    path: 'layout', component : LayoutComponent, children : [
      { path: 'historia', component: LibroPageComponent },
      {path: 'region/:id', component: UbicacionesRegionComponent  },
      {path: '', redirectTo: 'historia', pathMatch: 'full'} // Ruta por defecto
    ]
  },
  {
    path:'ciudad/:id', component: UbicacionesCiudadComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
