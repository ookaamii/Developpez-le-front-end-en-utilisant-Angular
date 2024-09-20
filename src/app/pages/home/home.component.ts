import { Component, OnInit, HostListener } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { delay } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<Olympic[]> = of([]);
  public pieChartData: { name: string; value: number }[] = [];
  public loadingOlympics: boolean = true; // Le loader
  public totalJOs: number = 0;
  public errorMessage: string = "";

  imageUrl: string = "/assets/medal.png"; // Image de la médaille dans le graphique

  // Options du graphique Pie Chart
  view: [number, number] = [900, 500];
  gradient: boolean = true;
  showLegend: boolean = false;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  trimLabels: boolean = false;

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#945F65', '#B8CCE7', '#88A1DA', '#783D51', '#9880A2']
  };
  // Fin options Pie Chart

  constructor(private olympicService: OlympicService, private router: Router) { }

  ngOnInit(): void {
    this.onResize();

    this.olympics$ = this.olympicService.getOlympics().pipe(
      delay(1000), // Simule un délai de chargement de 1 seconde pour vérifier si le loader s'affiche
    );

    this.olympics$.subscribe({
      next: olympics => {
        // Calcule les données pour le pie chart
        this.pieChartData = olympics.map(olympic => ({
          name: olympic.country,
          value: this.getTotalMedals(olympic.participations),
        }));

        // Calcule le nombre total de JO (année)
        this.totalJOs = this.getNumberJO(olympics);

        // Arrête le loader
        this.loadingOlympics = false;
      },
      error: err => {
        // Gérer l'erreur en affichant un message à l'utilisateur
        this.loadingOlympics = false;
        this.errorMessage = err.message;
      }
    });
  }

  // Redirige vers la page détail du pays
  onSelect(data: Event): void {
    const country = JSON.parse(JSON.stringify(data)).name;
    this.router.navigate(['/detail', country]);
  }

  getTotalMedals(participations: Participation[]): number {
    return this.olympicService.getTotalMedalsByCountry(participations);
  }

  getNumberJO(olympics: Olympic[]): number {
    const numberJO = new Set<number>();

    olympics.forEach(olympic => {
      olympic.participations.forEach(participation => {
        numberJO.add(participation.year); // Ajoute l'année à l'ensemble (évite les doublons)
      });
    });

    return numberJO.size; // Retourne le nombre d'années (sans doublon)
  }

  // Fonction pour redimensionner le graphique selon les tailles d'écran
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;

    if (innerWidth < 800) { // Cas des petits écrans (ex : téléphones)
      this.view = [innerWidth * 0.9, innerHeight / 3];
    } else if (innerWidth < 600) {
      this.view = [innerWidth * 0.9, innerHeight / 2.5];
    } else { // Cas des grands écrans (ex : bureaux)
      this.view = [900, 500];
    }
  }
}