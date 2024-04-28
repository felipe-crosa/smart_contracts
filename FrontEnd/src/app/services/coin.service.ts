import { Injectable } from '@angular/core';
import { Contract, ethers } from 'ethers';
import { COIN_CONTRACT_ABI } from '../abi';
import { MetamaskService } from './metamask.service';

@Injectable({
  providedIn: 'root'
})
export class CoinService {
  private contractAddress = "0x7507b317b075DE9d48B612351Ff905176EaE2e23";

  constructor(private metamask: MetamaskService) { 
  }

  async getCoinBalance() {
    const contract : any = new Contract(this.contractAddress, COIN_CONTRACT_ABI, this.metamask.provider?.getSigner());
    const balance = await contract.balanceOf(this.metamask.walletAddress)
    return balance.toNumber()
  }

  async buyCoins(amount : number) {
    const contract : any = new Contract(this.contractAddress, COIN_CONTRACT_ABI, this.metamask.provider?.getSigner());

    const rubiePrice = await contract.price();
    const tx =  await contract.mint(amount, this.metamask.walletAddress, {value: amount * rubiePrice });
    await tx.wait(1);
  }
}
