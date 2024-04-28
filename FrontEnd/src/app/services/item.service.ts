import { Injectable } from '@angular/core';
import { Contract, ethers } from 'ethers';
import { ITEM_CONTRACT_ABI } from '../abi';
import { NFT } from '../components/nft-modal/nft-modal.component';
import { MetamaskService } from './metamask.service';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private contractAddress = "0x89f297fc83C1f10345046a6B8AD2E18a7b0C9e2A";

  constructor(private metamask: MetamaskService) { 
  }

  async getItems() : Promise<NFT[]> {
    const contract : any = new Contract(this.contractAddress, ITEM_CONTRACT_ABI, this.metamask.provider?.getSigner());
    const itemCount = await contract.totalSupply()
    const metadatas = []
    const owners = []
    for(let i =1 ; i<=itemCount ; i++) {
      metadatas.push(contract.metadataOf(i))
      owners.push(contract.ownerOf(i))
    }
    const [finishedMetadata, finishedOwners] = await Promise.all([Promise.all(metadatas), Promise.all(owners)])

    const items = finishedMetadata.map((value, index) => {
      const item : NFT = {
        ID: index, 
        owner: finishedOwners[index], 
        creator: value.creator, 
        name: value.name, 
        imageURL: value.imageURL,
        amountOfOwners: value.amountOfOwners.toNumber()
      }
      return item
    })
    console.log(items)
    return items

    // return [{"name":"Monkey123", "amountOfOwners":1, imageURL: "https://yt3.googleusercontent.com/5RarOFS1Ckt2EWtOxtGLDNgbDo4dnXA4n8_9MFotaqkxGVyDiOy7fKeHgzNAubOUbrVQOvlKHQ=s900-c-k-c0x00ffffff-no-rj", owner: "123", ID:1, creator:"sfdfsg"}]

  }

  async getItem(tokenId: number): Promise<NFT> {
    const contract : any = new Contract(this.contractAddress, ITEM_CONTRACT_ABI, this.metamask.provider?.getSigner());
    const fetchMetadata = contract.metadataOf(tokenId)
    const fetchOwner = contract.ownerOf(tokenId)
    const [metadata, owner] = await Promise.all([fetchMetadata, fetchOwner])
    const item : NFT = {
      ID: tokenId, 
      owner, 
      creator: metadata.creator, 
      name: metadata.name, 
      imageURL: metadata.imageURL,
      amountOfOwners: metadata.amountOfOwners.toNumber()
    }
    return item
  }



  async createItem(name : string, image: string) {
    const contract : any = new Contract(this.contractAddress, ITEM_CONTRACT_ABI, this.metamask.provider?.getSigner());
    const tx = await contract.mint(name, image)
    await tx.wait(1)
  }
}
