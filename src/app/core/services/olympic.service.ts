import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, map, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { Participation } from '../models/Participation';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  public participations$: Observable<Participation[]> = of([]);

  constructor(private http: HttpClient) { }

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getOlympicByCountry(country: string): Observable<Olympic> {
    return this.olympics$.pipe(
      map(olympics => {
        const olympic = olympics.find(o => o.country === country);
        if (!olympic) {
          throw new Error(`Country ${country} not found`); // Émettre une erreur si le pays n'est pas trouvé
        }
        return olympic;
      }),
      // Gère l'erreur
      catchError(error => {
        console.error('Error fetching Olympic data:', error);
        return throwError(() => new Error(`Unable to fetch Olympic data for the country : ${country}`));
      })
    );
  }

  getTotalMedalsByCountry(participations: Participation[]): number {
    return participations.reduce((total, participation) => total + participation.medalsCount, 0);
  }

  getTotalAthletesByCountry(participations: Participation[]): number {
    return participations.reduce((total, participation) => total + participation.athleteCount, 0);
  }
}