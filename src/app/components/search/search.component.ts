import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, TranslateModule, CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {

  text: string = "";
  @Output() searchEmit = new EventEmitter<string>();


  onSearch() {
    let text = this.text.trim();
    if (text.length == 0 || text.length > 1) {
      this.searchEmit.emit(text.toLowerCase());
    }
  }

  onClearSearch() {
    this.text = '';
    this.searchEmit.emit('');
  }
}