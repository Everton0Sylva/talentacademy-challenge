import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertService } from '../../../services/alert.service';
import { HttprequestService } from '../../../services/httprequest.service';
import { Consent } from '../../../model/consent';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from '../../../components/search/search.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { timer } from 'rxjs';

@Component({
  selector: 'app-collected-consents',
  standalone: true,
  imports: [CommonModule, PaginationModule, TranslateModule, CommonModule, FormsModule, SearchComponent],
  templateUrl: './collected-consents.component.html',
  styleUrl: './collected-consents.component.scss'
})

export class CollectedConsentsComponent implements OnInit {

  private translate: TranslateService = inject(TranslateService);
  private alertService: AlertService = inject(AlertService);
  private httprequestService: HttprequestService = inject(HttprequestService);



  private spinner: NgxSpinnerService = inject(NgxSpinnerService);

  public intlCollator = new Intl.Collator('pt-BR', { sensitivity: 'base' });


  public backupData: any = null;
  public paginatedData: any[] = [];
  public totalData: any[] = [];
  public columns: Column[] = new Array<Column>();

  public currentSort = '';

  public pagination = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0
  }


  ngOnInit(): void {
    this.spinner.show();
    for (let key of Object.keys(new Consent())) {
      if (key != 'id') {
        // this.columns.push( Column = {
        let col: Column = {
          key: key,
          sort: key == 'consents' ? null : true,
        };
        this.columns.push(col);
      }
    }

    this.getList();
  }


  getList() {
    this.httprequestService.getConsents().subscribe({
      next: (resp) => {
        this.totalData = resp.map(data => {
          let consents: any = Object.entries(data.consents)
            .filter(values => {
              return values[1];
            })
            .map(values => {
              return values[0];
            });

          data.consents = consents;

          return data;
        });
        this.pagination.totalItems = this.totalData.length;

        this.updatePagination();
        timer(2000).subscribe(() => {
          this.spinner.hide();
        });

      },
      error: (error) => {
        this.alertService.error(this.translate.instant('internal-error'));
        this.spinner.hide();
      }
    })
  }

  onPageChange(event: any) {
    this.pagination.currentPage = event.page;
    this.updatePagination();
  }

  updatePagination() {
    const startIndex = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
    this.paginatedData = this.totalData.slice(startIndex, startIndex + this.pagination.itemsPerPage);
  }

  sortData(column: Column) {

    this.totalData.sort((a: any, b: any) => {
      return column.sort
        ? this.intlCollator.compare(a[column.key], b[column.key])
        : this.intlCollator.compare(b[column.key], a[column.key]);
    })
    if (this.currentSort != column.key) {
      if (this.currentSort != '') {
        this.columns.forEach(col => {
          if (col.key == this.currentSort) {
            col.sort = true;
          }
        })
      }
      this.currentSort = column.key;
    }
    column.sort = !column.sort;
    this.updatePagination();
  }

  onSearch(textSearch: string) {
    if (this.backupData == null) {
      this.backupData = [...this.totalData];
    }
    if (textSearch.length == 0) {
      this.totalData = [...this.backupData];

      this.backupData = null;
    } else {
      let filtered = this.backupData.filter((data: any) => data.name.toLowerCase().includes(textSearch));
      this.pagination.currentPage = 1;
      this.totalData = filtered;
    }
    this.updatePagination();
    this.pagination.totalItems = this.totalData.length;
  }


}

export type Column = {
  key: string;
  sort: boolean | null;
};