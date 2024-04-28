import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Offer, OfferModalComponent } from '../../components/offer-modal/offer-modal.component';
import { CoinService } from '../../services/coin.service';
import { SaleService } from '../../services/sale.service';

@Component({
  selector: 'app-sent-offers',
  standalone: true,
  imports: [OfferModalComponent, NavbarComponent, CommonModule],
  templateUrl: './sent-offers.component.html',
})
export class SentOffersComponent implements OnInit {
  coins: number = 0
  offers : Offer[] = []
  showOfferModal : boolean = false
  selectedOffer ?: Offer

  constructor(private coinService : CoinService, private saleService : SaleService){}

  async ngOnInit(): Promise<void> {
      await this.loadCoins()
  }

  async loadCoins(){
    this.coins = await this.coinService.getCoinBalance()
  }

  async loadOffers() {
    this.offers = await this.saleService.getSentOffers()
  }

  async showOffer(offer: Offer) {
    this.selectedOffer = offer
    this.showOfferModal = true
  }

  async closeOffer(update: boolean) {
    this.showOfferModal = false
    if(update) {
      await this.loadOffers()
    }
  }


}
