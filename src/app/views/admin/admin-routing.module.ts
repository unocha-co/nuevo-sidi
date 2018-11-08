import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdministrativeDivisionsComponent } from './administrative-divisions/administrative-divisions.component';
import { ContactGroupsComponent } from './contact-groups/contact-groups.component';
import { OrganizationProjectRelationComponent } from './organization-project-relation/organization-project-relation.component';
import { OrganizationTypesComponent } from './organization-types/organization-types.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { ProjectClassComponent } from './project-class/project-class.component';
import { UserProfilesComponent } from './user-profiles/user-profiles.component';
import { AllProjectsComponent } from './all-projects/all-projects.component';
import { ProjectComponent } from './all-projects/project.component';

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
    path: 'contact-groups',
    component: ContactGroupsComponent,
    data: {
      title: 'Contact Groups'
    }
  },
  {
    path: 'organization-project-relation',
    component: OrganizationProjectRelationComponent,
    data: {
      title: 'Organization Project Relation'
    }
  },
  {
    path: 'organization-types',
    component: OrganizationTypesComponent,
    data: {
      title: 'Organization Types'
    }
  },
  {
    path: 'organizations',
    component: OrganizationsComponent,
    data: {
      title: 'Organizations'
    }
  },
  {
    path: 'project-class',
    component: ProjectClassComponent,
    data: {
      title: 'Project Class'
    }
  },
  {
    path: 'user-profiles',
    component: UserProfilesComponent,
    data: {
      title: 'User Profiles'
    }
  },
    {
      path: 'all-projects',
      component: AllProjectsComponent,
      data: {
        title: 'Proyectos'
      }
    },
    {
      path: 'proyectos/:id',
      component: ProjectComponent,
      data: {
        title: 'Proyecto'
      }
    },
    {
      path: 'proyectos',
      component: ProjectComponent,
      data: {
        title: 'Proyecto'
      }
    }
  ]
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
