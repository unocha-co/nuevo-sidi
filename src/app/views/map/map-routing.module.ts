import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { MapComponent } from './map.component';

const routes: Routes = [
  {
    /* path: '',
		  data: {
		
		    title: 'MAP'
	},

    children: [
		  {
		    path: 'map',
		    component: MapComponent,
		    data: {
		      title: 'MAP'
		    }
		  }
	]*/

	path:'',
	component:MapComponent,
	data:{
		title:'Mapa de Proyectos'
	}
  }
   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapRoutingModule {}