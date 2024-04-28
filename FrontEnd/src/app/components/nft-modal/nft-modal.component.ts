import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MetamaskService } from '../../services/metamask.service';

export interface NFT {
  name: string,
  amountOfOwners: number
  owner: string,
  imageURL : string,
  ID: number,
  creator: string
}

@Component({
  selector: 'app-nft-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nft-modal.component.html',
})
export class NftModalComponent implements OnInit {
  @Input() nft !: NFT
  @Output() makeOffer = new EventEmitter()
  @Output() close = new EventEmitter()

  isOwner : boolean = false

  constructor(private metamaskService :MetamaskService){}

  ngOnInit(): void {
      this.isOwner = this.nft.owner.toLowerCase() == this.metamaskService.walletAddress?.toLowerCase()
  }

  execute = () => {
    this.makeOffer.emit()
  }
  closeModal = () => {
    this.close.emit()
  }
}
