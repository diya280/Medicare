import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicalDashboardComponent } from './medical-dashboard/medical-dashboard.component';

const routes: Routes = [
 { path:'dashboard', component: MedicalDashboardComponent},
];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class MedicalRoutingModule {}
