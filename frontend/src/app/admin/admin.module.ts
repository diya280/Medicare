import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "../header/header.component";
import { AdminRoutingModule } from "./admin.routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MainDashboardComponent } from "./main-dashboard/main-dashboard.component";
import { MedicalareaComponent } from "./medicalarea/medicalarea.component";
import { UserareaComponent } from "./userarea/userarea.component";




@NgModule({
  declarations: [DashboardComponent, MainDashboardComponent, MedicalareaComponent, UserareaComponent],
  imports: [
    AdminRoutingModule,CommonModule, HeaderComponent,ReactiveFormsModule, FormsModule,
],
schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})


export class AdminModule { }


