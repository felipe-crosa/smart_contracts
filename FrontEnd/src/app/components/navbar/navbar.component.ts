import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BuyCoinModalComponent } from '../buy-coin-modal/buy-coin-modal.component';
import { CreateNftModalComponent } from '../create-nft-modal/create-nft-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CreateNftModalComponent, BuyCoinModalComponent, CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  @Input() coins : number = 0
  @Output() created = new EventEmitter()
  @Output() bought = new EventEmitter()
  showBuyCoins = false
  showCreateToken = false

  buyCoins = () => {
    this.showBuyCoins = true
  }

  createToken = () => {
    this.showCreateToken = true
  }

  closeCreate = () => {
    this.showCreateToken = false
  }

  closeBuy = () => {
    this.showBuyCoins = false
  }

  createdToken = () => {
    this.showCreateToken = false
    this.created.emit()
  }

  boughtCoins = () => {
    this.showBuyCoins = false
    this.bought.emit()
  }

}
