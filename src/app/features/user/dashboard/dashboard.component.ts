import { Component, OnDestroy } from '@angular/core';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { AppState } from '../../../state/user/user.state';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../state/user/user.selector';
import { IUser } from '../../../core/models/IUser';
import { Observable, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    imports: [SidebarComponent, CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent{
 
}
