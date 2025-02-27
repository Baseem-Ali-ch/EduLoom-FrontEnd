import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { AppState } from '../../../state/user/user.state';
import { Store } from '@ngrx/store';
import { selectUser } from '../../../state/user/user.selector';
import { IUser } from '../../../core/models/IUser';
import { Observable, Subject, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ICourse } from '../../../core/models/ICourse';
import { CourseServiceService } from '../../../core/services/instructor/course.service.service';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    imports: [SidebarComponent, CommonModule, RouterModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy{
 allCourses: ICourse[] = [];
 
   private _subscription: Subscription = new Subscription();
   constructor(private _courseService: CourseServiceService) {}
 
   ngOnInit(): void {
     this.getCourse();
   }
 
   getCourse() {
     const couponSubscription = this._courseService.getCourses().subscribe({
       next: (response) => {
         this.allCourses = response.result;
       },
       error: (error) => {
         console.error(error);
       },
     });
     this._subscription.add(couponSubscription);
   }
 
   ngOnDestroy(): void {
     this._subscription.unsubscribe();
   }
}
