import { CommonModule } from '@angular/common';
import { Component, OnInit,} from '@angular/core';
import { SquareComponent } from './components/square/square.component';
import { SquaresService } from './services/squares.service';
import { SignalrConnectionInputComponent } from './components/signalr-connection-input/signalr-connection-input.component';
import { SignalRService } from './services/signalr.service';

@Component({
  selector: 'app-layout-squares',
  templateUrl: './layout-squares.component.html',
  styleUrl: './layout-squares.component.css',
  standalone: true,
  imports: [ CommonModule, SquareComponent, SignalrConnectionInputComponent ],
})
export class LayoutSquaresComponent implements OnInit{

  public squares?: boolean[];
  public isPlayerOne?: boolean;
  public isWinner?: boolean;
  public matchListId: string = '';
  public initialPlayer?: boolean;
  public activeButtons: boolean = false;
  public isSelectedGame?: boolean;

  constructor(
    private _squareService: SquaresService, 
    private _signalRService: SignalRService,
  ) {
  }

  ngOnInit(): void {
    this._squareService.squares$.subscribe(squares => {
      this.squares = squares;
      this.isPlayerOne = this._squareService.isPlayerOneValue;
      this.isWinner = this._squareService.isWinnerValue;
    });

    this._signalRService.connect().subscribe({
      next: () => {
        this._signalRService.hubConnection.on('ReceiveMatchValues', (value: number) => {
        });
      },
      error: err => {
        console.error("SendMatchValues error: ", err);
      }
    })

  }

  selectSquare(index: number): void {
    const selectionsCount = this.squares?.filter(sq => sq !== null).length;

    if(selectionsCount === 0){
      this.initialPlayer = this.isPlayerOne;
    }
    console.log(this.isPlayerOne);

    this._squareService.selectSquare(index);
    
    if(this.matchListId) {
      // console.log("clients: " + this.isMultiplayer);
      this.sendMatchValues(index);
    }
  }

  get isDone(): boolean {
    return this._squareService.isDone;
  }

  newGame(): void {
    if(this.isWinner) this.sendMatchValues(-1);
    this._squareService.resetGame();
  }

  onMatchId(id: string): void {
    if(!id) return;
    this.matchListId = id;
    this.isMultiplayer(id);
  }

  onActiveButtons(value: boolean): void {
    this.activeButtons = value;
  }

  onGameSelected(value: boolean): void {
    this.isSelectedGame = value;
  }

  private sendMatchValues(index: number): void {
    if(this.matchListId)
      this._signalRService.sendMatchValues(this.matchListId, index)
        .subscribe({
          next: () => {
            console.log("Valores enviados", this.activeButtons);
            this.activeButtons = !this.activeButtons;
          },
          error: (err) => {
            console.error('Error enviando valores del juego:', err);
          }
        })
  }

  private isMultiplayer(matchListId: string): void
  {
    this._signalRService.getIsMultiplayer(matchListId)
      .subscribe({
        next: () => {
          // console.log("size actualizado, " + this.isMultiplayer);
        },
        error: err => {
          console.error("Error en obtener tamaño del grupo: ", err);
        }
      });
  }
}
