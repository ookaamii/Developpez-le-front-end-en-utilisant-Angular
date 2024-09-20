import { Component, inject, HostListener } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, of, map } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Participation } from 'src/app/core/models/Participation';
import { Olympic } from 'src/app/core/models/Olympic';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NgxChartsModule
  ],
  providers: [
    TitleCasePipe
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  public olympicCountry$: Observable<Olympic> = of();
  public loadingOlympic: boolean = true; // Le loader
  public errorMessage: string = "";

  // Options du graphique
  public multi: { name: string; series: { name: string; value: number }[] }[] = [];
  view: [number, number] = [700, 300];
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Medals Count';
  timeline: boolean = true;

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#9880A2']
  };
  // Fin options Line Chart

  constructor(private olympicService: OlympicService, private titleCasePipe: TitleCasePipe) { }

  ngOnInit() {
    // On va d'abord appeler loadInitialData du service Olympic avant d'afficher les données par pays, sinon, cela risque de ne pas charger les données à temps et de provoquer une erreur "pays non trouvé"
    this.olympicService.loadInitialData().subscribe({
      next: () => {
        // On récupère le nom du pays dans l'url, que l'on met automatiquement avec la 1ère lettre en majuscule, pour qu'il match avec le json
        const country = this.titleCasePipe.transform(this.route.snapshot.params['country']);
        this.olympicCountry$ = this.olympicService.getOlympicByCountry(country);

        this.onResize();

        this.olympicCountry$.subscribe({
          next: olympic => {
            // Afficher les données récupérées par pays
            this.multi = [
              {
                name: olympic.country,
                series: olympic.participations.map(p => ({
                  name: p.year.toString(), // Convertir l'année en chaîne de caractères
                  value: p.medalsCount // Nombre de médailles pour chaque année
                }))
              }
            ];
            this.loadingOlympic = false;
          },
          error: err => {
            // Gérer l'erreur en affichant un message à l'utilisateur
            this.loadingOlympic = false;
            this.errorMessage = err.message;
          }
        });
      },
      error: err => {
        //console.error('Error loading Olympic data:', err);
      }
    });
  }

  getTotalMedals(participations: Participation[]): number {
    return this.olympicService.getTotalMedalsByCountry(participations);
  }

  getTotalAthletes(participations: Participation[]): number {
    return this.olympicService.getTotalAthletesByCountry(participations);
  }

  // Fonction pour redimensionner le graphique selon les tailles d'écran
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;

    if (innerWidth < 600) { // Cas des petits écrans (ex : téléphones)
      this.view = [innerWidth * 0.9, innerHeight / 3];
    } else { // Cas des grands écrans (ex : bureaux)
      this.view = [700, 400];
    }
  }
}
