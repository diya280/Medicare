import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MedicalDashboardComponent } from "./medical-dashboard/medical-dashboard.component";
import { MedicalRoutingModule } from "./medical.routing.module";
import { HeaderComponent } from "../header/header.component";
import { ViewpostComponent } from './viewpost/viewpost.component';
import { AddpostComponent } from './addpost/addpost.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";




@NgModule({
  declarations: [
    MedicalDashboardComponent,
    ViewpostComponent,
    AddpostComponent,
  ],
  imports: [
    HeaderComponent,
    CommonModule,
    MedicalRoutingModule,ReactiveFormsModule, FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class MedicalModule { }
