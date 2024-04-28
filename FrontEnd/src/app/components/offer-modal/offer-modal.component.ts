import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MetamaskService } from '../../services/metamask.service';
import { SaleService } from '../../services/sale.service';
import { NFT } from '../nft-modal/nft-modal.component';

export interface Offer {
  ID: number,
  nft: NFT,
  offeringAddress: string,
  amount: number,
  status: Status
}

export enum Status {
  Accepted = 'accepted',
  Rejected = 'rejected',
  Waiting = 'waiting',
  Canceled = 'canceled'
}

@Component({
  selector: 'app-offer-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offer-modal.component.html',
})
export class OfferModalComponent {
  @Input() offer !: Offer

  @Output() close = new EventEmitter<boolean>()

  constructor(private metamaskService: MetamaskService, private saleService: SaleService){}

  waiting = this.offer.status != Status.Waiting
  isSender = this.offer.offeringAddress == this.metamaskService.walletAddress

  async acceptOffer(){
    await this.saleService.acceptOffer(this.offer.ID)
    this.close.emit(true)
  }
  async rejectOffer(){
    await this.saleService.rejectOffer(this.offer.ID)
    this.close.emit(true)
  }
  async cancelOffer(){
    await this.saleService.cancelOffer(this.offer.ID)
    this.close.emit(true)
  }

  closeModal = () => {
    this.close.emit(false)
  }
}
