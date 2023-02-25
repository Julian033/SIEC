import { Injectable } from "@angular/core";
export interface Menu{
     state:string;
     name:string;
     icon:string;
     role:string;

}

const MENUITEMS = [
    {state:'dashboard',name:'Dashboard',icon:'dashboard',role:''},
    {state:'equipment',name:'Equipment',icon:'computer',role:'admin'},
    {state:'area',name:'Area',icon:'category',role:'admin'},
    {state:'type',name:'Type',icon:'list_alt',role:'admin'}
];

@Injectable()
export class MenuItems{
    getMenuitem(): Menu[]{
        return MENUITEMS;
    }
}