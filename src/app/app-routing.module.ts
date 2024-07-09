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
import { PreOpeningComponent } from './pages/pre-opening/pre-opening.component';
import { PostClosureComponent } from './pages/post-closure/post-closure.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { StartComponent } from './pages/start/start.component';
import { PreRegistrationComponent } from './pages/pre-registration/pre-registration.component';
import { SelfCheckInComponent } from './pages/self-check-in/self-check-in.component';
import { LoginRegistrationComponent } from './pages/login-registration/login-registration.component';


const routes: Routes = [
  { path: '', component: StartComponent },
  { path: 'login/:conference', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'complete-profile', component: CompleteProfileComponent },
  { path: 'conference-map', component: ConferenceMapComponent },
  { path: 'strategic-area', component: StrategicAreaComponent },
  { path: 'conference-steps', component: ConferenceStepsComponent },
  { path: 'how-it-works', component: HowItWorksComponent },
  { path: 'how-it-works-slim', component: HowItWorksSlimComponent },
  { path: 'proposals', component: ProposalsComponent },
  { path: 'participations', component: ParticipationsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: ':conference/post-closure', component: PostClosureComponent },
  { path: ':conference/pre-opening', component: PreOpeningComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'login-registration', component: LoginRegistrationComponent},
  { path: 'self-check-in/:conference/meeting/:meeting', component: SelfCheckInComponent},
  { path: 'registration/:conference/meeting/:meeting', component: PreRegistrationComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
