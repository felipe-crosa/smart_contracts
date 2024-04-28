import { Injectable } from '@angular/core';
import { ethers } from 'ethers';


declare global {
  interface Window{
    ethereum?: any
  }
}
@Injectable({
  providedIn: 'root'
})
export class MetamaskService {
  provider = window.ethereum ? new ethers.providers.Web3Provider(window?.ethereum) : null

  walletAddress ?: string;
  signer ?: ethers.Signer;

  constructor() { }

  async connectWallet() : Promise<string> {
    const metamask = window.ethereum;
    const selectedAddress = await metamask.request({ method: 'eth_requestAccounts' });
    this.walletAddress = selectedAddress[0];
    this.signer = this.provider?.getSigner(this.walletAddress);
    return this.walletAddress as string;
  }

  hasMetamask(): boolean {
    return window.ethereum !== undefined;
  }

  walletConnected() : boolean {
    return !!this.walletAddress
  }

  async ethBalance() {
    return await this.provider?.getBalance(this.walletAddress as string);
  }

}
