import { Component, Input } from '@angular/core';

@Component({
  selector: 'gyetube-permission',
  templateUrl: 'permission.html'
})
export class PermissionComponent {

  @Input() name: string;
  @Input() permission: string[];

  constructor() {
  }

  has(permission:string[], str: string): boolean {
    if (permission instanceof Array)
      return permission.some(val => val == str);
    else
      return false;
  }
}
