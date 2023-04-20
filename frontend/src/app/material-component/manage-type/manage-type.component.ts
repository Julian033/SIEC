import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TypeService } from 'src/app/services/type.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { TypeComponent } from '../dialog/type/type.component';

@Component({
  selector: 'app-manage-type',
  templateUrl: './manage-type.component.html',
  styleUrls: ['./manage-type.component.scss']
})
export class ManageTypeComponent implements OnInit {
  displayedColumns:string[]= ['name','edit'];
  dataSource:any;
  responseMessage: any;
  pageSizeOptions: number[] = [5, 10, 25, 50];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  
  constructor(private typeService:TypeService,
    private ngxService:NgxUiLoaderService,
    private dialog:MatDialog,
    private snackbarService:SnackbarService,
    private router:Router) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData(){
    this.typeService.getType().subscribe((response:any)=>{
      this.ngxService.stop();
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
    },(error:any)=>{
      this.ngxService.stop();
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })
  }

  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
  }

  handleAddAction(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data={
      action:'Agregar'
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(TypeComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onAddType.subscribe(
      (response)=>{
        this.tableData();

      }
    )    
  }

  handleEditAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data={
      action:'Editar',
      data:values
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(TypeComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditType.subscribe(
      (response)=>{
        this.tableData();

      }
    ) 
  }

  handleDeleteAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data={
      message:'Eliminar '+values.name+ ''
    };
    const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response)=>{
      this.ngxService.start();
      this.deleteType(values.typeId);
      dialogRef.close();
    })
    
  }

  deleteType(typeId:any){
    this.typeService.delete(typeId).subscribe((response:any)=>{
      this.ngxService.stop();
      this.tableData();
      this.responseMessage = response?.message;
      this.snackbarService.openSnackBar(this.responseMessage,'success');

    },(error:any)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message;
      }
      else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.error);
    })

  }
}
