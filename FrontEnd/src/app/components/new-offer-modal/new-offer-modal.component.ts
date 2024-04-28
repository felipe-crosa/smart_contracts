import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SaleService } from '../../services/sale.service';
import { NFT } from '../nft-modal/nft-modal.component';

@Component({
  selector: 'app-new-offer-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-offer-modal.component.html',
})
export class NewOfferModalComponent {
  @Input() nft!: NFT
  @Output() close = new EventEmitter()
  amount : number = 1

  constructor(private saleService : SaleService){}

  async makeOffer() {
    await this.saleService.publishOffer(this.nft.ID, this.amount)
    this.close.emit()
  }

  closeModal () {
    this.close.emit()
  }

}
