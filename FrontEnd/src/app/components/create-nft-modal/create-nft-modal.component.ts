import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-create-nft-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-nft-modal.component.html',
})
export class CreateNftModalComponent {
  @Output() created = new EventEmitter()
  @Output() close  = new EventEmitter()

  name: string = ""
  image: string = ""

  constructor(private itemService : ItemService){}

  async create() {
    await this.itemService.createItem(this.name, this.image)
    this.created.emit()
  }

  closeModal () {
    this.close.emit()
  }

}
