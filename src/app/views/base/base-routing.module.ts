import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdministrativeDivisionsComponent } from '../admin/administrative-divisions/administrative-divisions.component';
import { ContactGroupsComponent } from '../admin/contact-groups/contact-groups.component';
import { OrganizationProjectRelationComponent } from '../admin/organization-project-relation/organization-project-relation.component';
import { OrganizationTypesComponent } from '../admin/organization-types/organization-types.component';
import { OrganizationsComponent } from '../admin/organizations/organizations.component';
import { ProjectClassComponent } from '../admin/project-class/project-class.component';
import { UserProfilesComponent } from '../admin/user-profiles/user-profiles.component';

const routes: Routes = [
{
  path: '',
  data: {
    title: 'Administrar'
  },
  children: [
  {
    path: 'administrative-divisions',
    component: AdministrativeDivisionsComponent,
    data: {
      title: 'Divisiones Administrativas'
    }
  },
  {
    path: 'Admin',
    component: ContactGroupsComponent,
    data: {
      title: 'Contact Groups'
    }
  },
  {
    path: 'Admin',
    component: OrganizationProjectRelationComponent,
    data: {
      title: 'Organization Project Relation'
    }
  },
  {
    path: 'Admin',
    component: OrganizationTypesComponent,
    data: {
      title: 'Organization Types'
    }
  },
  {
    path: 'Admin',
    component: OrganizationsComponent,
    data: {
      title: 'Organizations'
    }
  },
  {
    path: 'Admin',
    component: ProjectClassComponent,
    data: {
      title: 'Project Class'
    }
  }

  ]
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule {}
