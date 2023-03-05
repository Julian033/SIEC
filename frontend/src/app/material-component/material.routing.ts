import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouteGuardService } from '../services/route-guard.service';
import { ManageAreaComponent } from './manage-area/manage-area.component';
import { ManageEquipmentComponent } from './manage-equipment/manage-equipment.component';
import { ManageTypeComponent } from './manage-type/manage-type.component';
import { ManageUserComponent } from './manage-user/manage-user.component';



export const MaterialRoutes: Routes = [
    {
        path:'equipment',
        component:ManageEquipmentComponent,
        canActivate:[RouteGuardService],
        data:{
            expectedRole:['admin']
        }   
    },

    {
        path:'area',
        component:ManageAreaComponent,
        canActivate:[RouteGuardService],
        data:{
            expectedRole:['admin']
        }   
    },

    {
        path:'type',
        component:ManageTypeComponent,
        canActivate:[RouteGuardService],
        data:{
            expectedRole:['admin']
        }   
    },

    {
        path:'user',
        component:ManageUserComponent ,
        canActivate:[RouteGuardService],
        data:{
            expectedRole:['admin']
        }   
    }
    
];


