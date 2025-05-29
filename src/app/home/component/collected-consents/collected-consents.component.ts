import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertService } from '../../../services/alert.service';
import { HttprequestService } from '../../../services/httprequest.service';
import { Consent } from '../../../model/consent';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-collected-consents',
  standalone: true,
  imports: [CommonModule, PaginationModule, TranslateModule, CommonModule, FormsModule],
  templateUrl: './collected-consents.component.html',
  styleUrl: './collected-consents.component.scss'
})
export class CollectedConsentsComponent implements OnInit {

  private translate: TranslateService = inject(TranslateService);
  private alertService: AlertService = inject(AlertService);
  private httprequestService: HttprequestService = inject(HttprequestService);


  public paginatedData: Consent[] = [];
  public consents: Consent[] = [];
  public columns!: string[]

  public pagination = {
    currentPage: 1,
    itemsPerPage: 10
  }


  ngOnInit(): void {
    this.columns = Object.keys(new Consent());

    this.getList();
  }


  getList() {
    this.httprequestService.getConsents().subscribe({
      next: (resp) => {
        this.consents = resp;
        this.updatePagination();
      },
      error: (error) => {

      }
    })
  }

  onPageChange(event: any) {
    this.pagination.currentPage = event.page;
    this.updatePagination();
  }

  updatePagination() {
    const startIndex = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
    this.paginatedData = this.consents.slice(startIndex, startIndex + this.pagination.itemsPerPage);
  }

  sortData(column: string) {
    this.paginatedData.sort((a: any, b: any) => (a[column] > b[column] ? 1 : -1));
    this.updatePagination();
  }

}
