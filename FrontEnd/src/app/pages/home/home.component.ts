import { Component, OnInit } from '@angular/core';
import { CreateNftModalComponent } from '../../components/create-nft-modal/create-nft-modal.component';
import { NFT, NftModalComponent } from '../../components/nft-modal/nft-modal.component';
import { NewOfferModalComponent } from '../../components/new-offer-modal/new-offer-modal.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CoinService } from '../../services/coin.service';
import { CommonModule } from '@angular/common';
import { ItemService } from '../../services/item.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NftModalComponent, NewOfferModalComponent, CreateNftModalComponent, NavbarComponent, CommonModule],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit{

  coins : number = 0
  items : NFT[] = []
  selectedItem ?: NFT 
  showNFT : boolean = false
  showMakeOffer : boolean = false
  showCreate : boolean = false


  constructor(private coinService: CoinService, private itemService: ItemService) {}

  async ngOnInit(): Promise<void> {
      await this.loadData()
  }

  setSelection(nft?: NFT) {
    this.selectedItem = nft
    this.showNFT = true
  }

  makeOffer() {
    this.showNFT = false
    this.showMakeOffer = true
  }

  async closeOffer() {
    this.showMakeOffer = false
    this.selectedItem = undefined
    this.coins = await this.coinService.getCoinBalance()
  }

  async closeNFT() {
    this.showNFT = false
    this.selectedItem = undefined
  }

  
  async loadData(){
    this.coins = await this.coinService.getCoinBalance()
    this.items = await this.itemService.getItems()
  }

  async loadCoins(){
    this.coins = await this.coinService.getCoinBalance()
  }

}
