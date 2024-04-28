import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ReceivedOffersComponent } from './pages/received-offers/received-offers.component';
import { SentOffersComponent } from './pages/sent-offers/sent-offers.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path:'offers/sent', component: SentOffersComponent},
    {path:'offers/recieved', component: ReceivedOffersComponent}
];
