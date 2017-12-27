import { Component, Input } from '@angular/core';

@Component({
  selector: 'grasscube-permission',
  templateUrl: 'permission.html'
})
export class PermissionComponent {

  @Input() name: string;
  @Input() permission: number;

  constructor() {
  }

  bitwiseOR(permission, mask): boolean {
    return !!(permission & mask);
  }
}
