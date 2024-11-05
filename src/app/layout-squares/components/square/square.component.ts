import { CommonModule } from '@angular/common';
import { Component, input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrl: './square.component.css',
  standalone: true,
  imports: [CommonModule]
})
export class SquareComponent{
  public isX = input<boolean | null>(null); 

  get displayValue(): string {
    if(this.isX() === true) return 'X';
    else if(this.isX() === false) return 'O';
    else return '';
  }
}
