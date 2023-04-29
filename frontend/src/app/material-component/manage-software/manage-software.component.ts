import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SoftwareService } from 'src/app/services/software.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { SoftwareComponent } from '../dialog/software/software.component';

@Component({
  selector: 'app-manage-software',
  templateUrl: './manage-software.component.html',
  styleUrls: ['./manage-software.component.scss']
})
export class ManageSoftwareComponent implements OnInit {

  displayedColumns:string [] = ['inventory','antivirus', 'office', 'systemo', 'edit'];
  dataSource:any;
  responseMessage: any;
  pageSizeOptions: number[] = [50, 100, 500, 1000];


  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  
  constructor(private softwareService:SoftwareService,
    private ngxService:NgxUiLoaderService,
    private dialog:MatDialog,
    private snackbarService:SnackbarService,
    private router:Router) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData(){
    this.softwareService.getSoftware().subscribe((response:any)=>{
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

  handleEditAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data={
      action:'Editar',
      data:values
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(SoftwareComponent,dialogConfig);
    this.router.events.subscribe(()=>{
      dialogRef.close();
    });
    const sub = dialogRef.componentInstance.onEditSoftware.subscribe(
      (response)=>{
        this.tableData();

      }
    ) 
  }

}
