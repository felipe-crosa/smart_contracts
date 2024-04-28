import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MetamaskService } from './services/metamask.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'FrontEnd';
  metamaskConnected = false
  walletConnected = false

  constructor(private metamask : MetamaskService) {}

  ngOnInit(): void {
    this.metamaskConnected = this.metamask.hasMetamask();
  }

  connectWallet = async () => {
    const address = await this.metamask.connectWallet()
    console.log(address)
    this.walletConnected = true
  }
}
