import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { RegisterComponent } from './pages/register/register.component';
import { HowItWorksSlimComponent } from './pages/how-it-works-slim/how-it-works-slim.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CompleteProfileComponent } from './pages/complete-profile/complete-profile.component';
import { LoginComponent } from './pages/login/login.component';
import { ConferenceMapComponent } from './pages/conference-map/conference-map.component';
import { StrategicAreaComponent } from './pages/strategic-area/strategic-area.component';
import { ConferenceStepsComponent } from './pages/conference-steps/conference-steps.component';
import { HowItWorksComponent } from './pages/how-it-works/how-it-works.component';
import { ProposalsComponent } from './pages/proposals/proposals.component';
import { ParticipationsComponent } from './pages/participations/participations.component';

const routes: Routes = [
  { path: '', redirectTo: 'login/', pathMatch: 'full' },  
  { path: 'login', redirectTo: 'login/', pathMatch: 'full' },
  { path: 'login/:conference', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'complete-profile', component: CompleteProfileComponent },
  { path: 'conference-map', component: ConferenceMapComponent },
  { path: 'strategic-area', component: StrategicAreaComponent },
  { path: 'conference-steps/:id', component: ConferenceStepsComponent },
  { path: 'how-it-works', component: HowItWorksComponent },
  { path: 'how-it-works-slim', component: HowItWorksSlimComponent },
  { path: 'proposals', component: ProposalsComponent },
  { path: 'participations', component: ParticipationsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
