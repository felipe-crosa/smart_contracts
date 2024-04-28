import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoinService } from '../../services/coin.service';

@Component({
  selector: 'app-buy-coin-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './buy-coin-modal.component.html',
})
export class BuyCoinModalComponent {
    @Output() close = new EventEmitter()
    @Output() bought = new EventEmitter()
    amount : number = 1

    constructor(private coinService : CoinService){}

    async buy() {
      await this.coinService.buyCoins(this.amount)
      this.bought.emit()
    }
    closeModal () {
      this.close.emit()
    }

}
