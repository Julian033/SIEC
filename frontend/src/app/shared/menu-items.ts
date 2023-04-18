import { Injectable } from "@angular/core";
export interface Menu{
     state:string;
     name:string;
     icon:string;
     role:string;

}

const MENUITEMS = [
    {state:'dashboard',name:'Panel Principal',icon:'dashboard',role:''},
    {state:'equipment',name:'Equipos',icon:'inventory_2',role:'admin'},
    {state:'area',name:'Ver Areas',icon:'category',role:'admin'},
    {state:'type',name:'Ver Tipos de Equipos',icon:'list_alt',role:'admin'},
    {state:'user',name:'Ver Usuarios',icon:'people',role:'admin'}
];

@Injectable()
export class MenuItems{
    getMenuitem(): Menu[]{
        return MENUITEMS;
    }
}