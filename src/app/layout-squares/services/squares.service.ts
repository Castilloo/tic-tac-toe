import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SquaresService {

  private squares: boolean[] = Array(9).fill(null);
  private isPlayerOne = true;
  private isWinner: boolean = false;

  private squaresSubject = new BehaviorSubject<boolean[]>(this.squares);
  public squares$ = this.squaresSubject.asObservable();

  get isPlayerOneValue(): boolean {
    return this.isPlayerOne;
  }

  get isWinnerValue(): boolean {
    return this.isWinner;
  }

  selectSquare(index: number): void {
    if(this.squares[index] !== null) return;
    this.squares[index] = this.isPlayerOne;
    this.playerWon(this.isPlayerOne);
    this.isPlayerOne = !this.isPlayerOne;
    this.squaresSubject.next(this.squares);
  }

  private playerWon(isPlayer: boolean): void {
    const sq = this.squares;      
    const numbersToReview = [ 0, 1, 2, 3, 6 ];
    
    for(let num of numbersToReview) {
      if(this.isWinner) break;
      if(sq[num] !== null){
        this.checkSquares(num, isPlayer);
      }
    }     
  }

  private checkSquares(num: number, isPlayer: boolean) {
    if(num === 0) {
      // debugger;
      this.isWinner = this.mapSquares(num, 4, isPlayer);
      if(this.isWinner) return;
    }

    if(num === 2) {
      this.isWinner = this.mapSquares(num, 2, isPlayer);
      if(this.isWinner) return;
    }

    if(num === 0 || num === 1 || num === 2) {
      this.isWinner = this.mapSquares(num, 3, isPlayer);
      if(this.isWinner) return;
    }
    
    if(num === 0 || num === 3 || num === 6) {
      this.isWinner = this.mapSquares(num, 1, isPlayer);
      if(this.isWinner) return;
    }
  }

  private mapSquares(initalNumber:number, position: number, isPlayer: boolean): boolean {
    return this.squares.reduce<boolean[]>((acc, cur, i) => {
        if(i === initalNumber || i === initalNumber + position || i === initalNumber + position * 2) acc.push(cur); 
        return acc;
      }, [])
      .every(val => val === isPlayer);
  }

  get isDone(): boolean {
    return this.squares.every(val => val !== null);
  }

  resetGame(): void {
    this.squares = Array(9).fill(null);
    this.isPlayerOne = true;
    this.isWinner = false;
    this.squaresSubject.next([...this.squares]);
  }
}
