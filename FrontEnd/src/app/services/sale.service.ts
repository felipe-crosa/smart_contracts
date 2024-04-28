import { Injectable } from '@angular/core';
import { Contract, ethers } from 'ethers';
import { SALE_CONTRACT_ABI } from '../abi';
import { Offer, Status } from '../components/offer-modal/offer-modal.component';
import { ItemService } from './item.service';
import { MetamaskService } from './metamask.service';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private contractAddress = "0x6F61F76136B21bD90CFB5F8761A60e8EcDdB1Bd8";
  
  constructor(private metamask: MetamaskService, private itemService : ItemService) {}

  async getSentOffers() : Promise<Offer[]> {
    const STATUS = [Status.Accepted, Status.Rejected, Status.Waiting, Status.Canceled]

    const contract : any = new Contract(this.contractAddress, SALE_CONTRACT_ABI, this.metamask.provider?.getSigner());
    const offers = await contract.userSentOffers(this.metamask.walletAddress)

    const metadata = await Promise.all(offers.map((x: any)=> {
      const id = x.toNumber()
      return contract.offerMetadata(id)
    }))


    const nfts = await Promise.all(metadata.map(meta => {
      const id = meta.wantedTokenId.toNumber()
      return this.itemService.getItem(id)
    }))

    const res =  metadata.map((value, index) => {
      const offer : Offer = {
        ID: offers[index],
        nft: nfts[index],
        amount: value.amount.toNumber(),
        status: STATUS[value.status],
        offeringAddress: value.offeringAddress
      }
      return offer
    })
    return res
  }

  async getReceivedOffers() : Promise<Offer[]> {
    const STATUS = [Status.Accepted, Status.Rejected, Status.Waiting, Status.Canceled]

    const contract : any = new Contract(this.contractAddress, SALE_CONTRACT_ABI, this.metamask.provider?.getSigner());
    const offers = await contract.userReceivedOffers(this.metamask.walletAddress)

    const metadata = await Promise.all(offers.map((x: any)=> {
      const id = x.toNumber()
      return contract.offerMetadata(id)
    }))


    const nfts = await Promise.all(metadata.map(meta => {
      const id = meta.wantedTokenId.toNumber()
      return this.itemService.getItem(id)
    }))

    const res =  metadata.map((value, index) => {
      const offer : Offer = {
        ID: offers[index].toNumber(),
        nft: nfts[index],
        amount: value.amount.toNumber(),
        status: STATUS[value.status],
        offeringAddress: value.offeringAddress
      }
      return offer
    })
    return res
  }



  async publishOffer(tokenID: number, amount: number) {
    const contract : any = new Contract(this.contractAddress, SALE_CONTRACT_ABI, this.metamask.provider?.getSigner());
    const tx = await contract.publishOffer(tokenID, amount)
    await tx.wait(1)
  }

  async cancelOffer(offerId: number) {
    const contract : any = new Contract(this.contractAddress, SALE_CONTRACT_ABI, this.metamask.provider?.getSigner());
    const tx = await contract.cancelOffer(offerId)
    await tx.wait(1)
  }

  async acceptOffer(offerId: number) {
    const contract : any = new Contract(this.contractAddress, SALE_CONTRACT_ABI, this.metamask.provider?.getSigner());
    const tx = await contract.acceptOffer(offerId)
    await tx.wait(1)
  }

  async rejectOffer(offerId: number) {
    const contract : any = new Contract(this.contractAddress, SALE_CONTRACT_ABI, this.metamask.provider?.getSigner());
    const tx = await contract.rejectOffer(offerId)
    await tx.wait(1)
  }
}
