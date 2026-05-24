import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividendData } from '../dividend-data.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  dividendData: DividendData[] = [];

  ngOnInit(): void {
    this.dividendData = [
      {
        ticker: 'BNP.PA',
        companyName: 'BNP Paribas',
        year: 2023,
        dividendAmount: 3.90,
        yieldPercentage: 6.5,
      },
      {
        ticker: 'BNP.PA',
        companyName: 'BNP Paribas',
        year: 2022,
        dividendAmount: 3.67,
        yieldPercentage: 6.8,
      },
      {
        ticker: 'BNP.PA',
        companyName: 'BNP Paribas',
        year: 2021,
        dividendAmount: 2.66,
        yieldPercentage: 5.2,
      },
      {
        ticker: 'SU.PA',
        companyName: 'Schneider Electric',
        year: 2023,
        dividendAmount: 3.15,
        yieldPercentage: 1.8,
      },
      {
        ticker: 'SU.PA',
        companyName: 'Schneider Electric',
        year: 2022,
        dividendAmount: 2.90,
        yieldPercentage: 2.1,
      },
      {
        ticker: 'SU.PA',
        companyName: 'Schneider Electric',
        year: 2021,
        dividendAmount: 2.60,
        yieldPercentage: 1.9,
      }
    ];
  }
}
