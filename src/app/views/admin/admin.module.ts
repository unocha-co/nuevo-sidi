import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomFormsModule } from 'ng2-validation'

import { AdministrativeDivisionsComponent } from './administrative-divisions/administrative-divisions.component';
import { ContactGroupsComponent } from './contact-groups/contact-groups.component';
import { OrganizationProjectRelationComponent } from './organization-project-relation/organization-project-relation.component';
import { OrganizationTypesComponent } from './organization-types/organization-types.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { ProjectClassComponent } from './project-class/project-class.component';
import { UserProfilesComponent } from './user-profiles/user-profiles.component';
import { AllProjectsComponent } from './all-projects/all-projects.component';
import { ProjectComponent } from './all-projects/project.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AdminRoutingModule } from './admin-routing.module';
import { ValidationError } from '../error/validation-error.component';
import { ErrorMessagePipe } from '../../pipes/error-messaje';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CustomFormsModule,
    AdminRoutingModule,
    ModalModule.forRoot(),
    NgSelectModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [
    AdministrativeDivisionsComponent,
    ContactGroupsComponent,
    OrganizationProjectRelationComponent,
    OrganizationTypesComponent,
    OrganizationsComponent,
    ProjectClassComponent,
    UserProfilesComponent,
    AllProjectsComponent,
    ProjectComponent,
    ValidationError,
    ErrorMessagePipe
  ]
})
export class AdminModule { }
