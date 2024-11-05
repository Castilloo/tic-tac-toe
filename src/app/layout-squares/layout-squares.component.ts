import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SquareComponent } from './components/square/square.component';
import { SquaresService } from './services/squares.service';

@Component({
  selector: 'app-layout-squares',
  templateUrl: './layout-squares.component.html',
  styleUrl: './layout-squares.component.css',
  standalone: true,
  imports: [ CommonModule, SquareComponent ],
})
export class LayoutSquaresComponent implements OnInit{
  public squares?: boolean[];
  public isPlayerOne?: boolean;
  public isWinner?: boolean;

  constructor(private _squareService: SquaresService) {
  }
  ngOnInit(): void {
    this._squareService.squares$.subscribe(squares => {
      this.squares = squares;
      this.isPlayerOne = this._squareService.isPlayerOneValue;
      this.isWinner = this._squareService.isWinnerValue;
    })
  }

  selectSquare(index: number): void {
    this._squareService.selectSquare(index);
  }

  get isDone(): boolean {
    return this._squareService.isDone;
  }

  newGame(): void {
    this._squareService.resetGame();  
  }
}
