import { Component, inject, OnInit, Output, output, OutputEmitterRef } from '@angular/core';
import { SignalRService } from '../../services/signalr.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SquaresService } from '../../services/squares.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-signalr-connection-input',
  templateUrl: './signalr-connection-input.component.html',
  styleUrl: './signalr-connection-input.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [SignalRService]
})
export class SignalrConnectionInputComponent implements OnInit{
  public matchListId = '';
  public squareValues: boolean[] = [];
  public matchListIdInput = '';
  public onMatchIdEvent = output<string>();
  public onActiveButtons = output<boolean>();
  public onGameSelected = output<boolean>();
  public activeButtons: boolean = false;
  public isSelectedGame: boolean = false;
  public errorConnDiv: boolean = false;
  
  constructor(
    private readonly _squareService: SquaresService,
    private readonly _signalRService: SignalRService
  ){}

  ngOnInit(): void {
    this.connectSignalR();
  }

  public localGame(): void {
    this.isSelectedGame = true;
    this.onGameSelected.emit(this.isSelectedGame);
  }

  private connectSignalR(): void {
    this._signalRService
      .connect()
      .subscribe({
        next: () => {
          this._signalRService.hubConnection.on('MatchListCreated', (createdId: string) => {
            this.matchListId = createdId;
          });

          this._signalRService.hubConnection.on('JoinMatchList', (matchId: string, list: boolean[]) => {
            this.matchListId = matchId;
            this.squareValues = list;
            this.onMatchIdEvent.emit(this.matchListId);
            console.log("Enviado Join", this.matchListId);
            this.onGameSelected.emit(true);
          });

          this._signalRService.hubConnection.on('ReceiveMatchValues', (value: number) => {
            if(value === -1) this._squareService.resetGame();
            else this._squareService.selectSquare(value);
            
            this.onActiveButtons.emit(this.activeButtons);
            console.log("Valor recibido: " + value);
          });

          this._signalRService.onGetIsMultiplayer();
        },
        error: (err) => {
          console.error("Signal error: ", err);
        }
      })
  }

  createMatchList(): void {
    this._signalRService.createMatchList()
    .pipe(catchError((err) => {
      console.error('Error creating matchList:', err);
      this.errorConnDiv = true;
      return of(null);
    }))
    .subscribe({
      next: () => {
        console.log('Trying connection')
      }
    });

    setTimeout(() => this.errorConnDiv = false, 1500);
  }

  joinMatchList(): void {
    if(this.matchListIdInput && this._signalRService.hubConnection.state === "Connected"){
      this._signalRService.joinMatchList(this.matchListIdInput).subscribe({
        next: () => {
          this.matchListIdInput = '';
        },
        error: (err) => {
          console.error('Error joining match list:', err);
        }
      });
    }
  }
}
