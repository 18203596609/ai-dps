import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { CodebaseService } from '../service/codebase.service';
import { DataManageService } from '../service/data_manage.service';
declare const lenovoPublic;
@Injectable()
export class IsLoginedAuthGuard implements CanActivate {
    constructor(private router: Router, private codebaseService: CodebaseService, private dataManageService: DataManageService) { }
    // 路由验证是否登陆
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        const url: string = state.url;
        lenovoPublic.selfLog2(() => console.log(url, state));
        return this.checkLogin(url);
    }

    // 子路由验证是否登陆
    canActivateChild(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    checkLogin(url: string): boolean {
        const isLoggedIn = this.dataManageService.getLogined();
        if (isLoggedIn) { return true; }
        // Store the attempted URL for redirecting
        // this.loginService.redirectUrl = url;

        // Navigate to the login page with extras
        this.router.navigate(['/login']);
        return false;
    }
}
