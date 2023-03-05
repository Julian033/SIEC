import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialRoutes } from './material.routing';
import { MaterialModule } from '../shared/material-module';
import { ViewBillProductsComponent } from './dialog/view-bill-products/view-bill-products.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { ChangePasswordComponent } from './dialog/change-password/change-password.component';
import { ManageEquipmentComponent } from './manage-equipment/manage-equipment.component';
import { EquipmentComponent } from './dialog/equipment/equipment.component';
import { ManageAreaComponent } from './manage-area/manage-area.component';
import { AreaComponent } from './dialog/area/area.component';
import { ManageTypeComponent } from './manage-type/manage-type.component';
import { TypeComponent } from './dialog/type/type.component';
import { ManageUserComponent } from './manage-user/manage-user.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MaterialRoutes),
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule
  ],
  providers: [],
  declarations: [
    ViewBillProductsComponent,
    ConfirmationComponent,
    ChangePasswordComponent,
    ManageEquipmentComponent,
    EquipmentComponent,
    ManageAreaComponent,
    AreaComponent,
    ManageTypeComponent,
    TypeComponent,
    ManageUserComponent
  ]
})
export class MaterialComponentsModule {}
