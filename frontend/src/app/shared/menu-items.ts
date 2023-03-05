import { Injectable } from "@angular/core";
export interface Menu{
     state:string;
     name:string;
     icon:string;
     role:string;

}

const MENUITEMS = [
    {state:'dashboard',name:'Dashboard',icon:'dashboard',role:''},
    {state:'equipment',name:'Equipment',icon:'inventory_2',role:'admin'},
    {state:'area',name:'View Area',icon:'category',role:'admin'},
    {state:'type',name:'View Type',icon:'list_alt',role:'admin'},
    {state:'user',name:'View Users',icon:'people',role:'admin'}
];

@Injectable()
export class MenuItems{
    getMenuitem(): Menu[]{
        return MENUITEMS;
    }
}