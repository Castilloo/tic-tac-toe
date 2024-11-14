import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { catchError, from, Observable, of } from 'rxjs';
import { SquaresService } from './squares.service';

@Injectable({providedIn: 'root'})
export class SignalRService {
    private readonly _hubConnection: HubConnection;

    constructor() {
        this._hubConnection = new HubConnectionBuilder()
            .withUrl("https://localhost:5001/gameHub")
            .build();
    }

    get hubConnection(): HubConnection {
        return this._hubConnection;
    }

    connect(): Observable<void> {
        return from(this._hubConnection.start());
    }

    createMatchList(): Observable<void | null> {
        return from(this.hubConnection.invoke('CreateMatchList'));
    }

    joinMatchList(matchListId: string): Observable<void> {
        return from(this.hubConnection.invoke('JoinMatchList', matchListId));
    }

    sendMatchValues(matchListId: string, matchValue: number): Observable<void> {
        return from(this.hubConnection.invoke('SendMatchValues', matchListId, matchValue));
    }

    getIsMultiplayer(matchListId: string): Observable<boolean> {
        return from(this._hubConnection.invoke('GetIsMultiplayer', matchListId));
    }

    onReceiveMatchValues(squareService: SquaresService): void {
        this._hubConnection.on('ReceiveMatchValues', (value: number) => {
            if(value === -1) squareService.resetGame();
            else squareService.selectSquare(value);
            
            console.log("Valor recibido: " + value);
        });
    }

    onGetIsMultiplayer(): void {
        this._hubConnection.on('GetIsMultiplayer', (isMultiplayer: boolean) => {
            console.log(`Es multiplayer: ${isMultiplayer}`);
        });
    }

}