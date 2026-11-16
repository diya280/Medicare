import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserDashboardComponent } from "./user-dashboard/user-dashboard.component";
import { UserRoutingModule } from "./user.routing.module";
import { HeaderComponent } from "src/app/header/header.component";
import { ViewareaComponent } from './viewarea/viewarea.component';
import { FormsModule } from "@angular/forms";
import { MedicalDetailsComponent } from "./medical-details/medical-details.component";


@NgModule({
  declarations: [
    UserDashboardComponent, ViewareaComponent, MedicalDetailsComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    UserRoutingModule,
    HeaderComponent
]
})
export class UserModule { }
