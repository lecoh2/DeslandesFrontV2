import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DashboardFinanceiroService } from '../../../../core/services/dashboard-financeiro.service';
import { DashboardFinanceiroResponse } from '../../../../core/models/dashborad-financeiro/dashboard-financeiro-response';
import { Chart } from 'chart.js/auto';
import { FormsModule } from '@angular/forms';

import { ConfiguracaoFinanceiraService } from '../../../../core/services/configuracao-financeira.service';
@Component({
  selector: 'app-dashboard-financeiro',
  standalone:false,
  templateUrl: './dashboard-financeiro.html',
  styleUrls: ['./dashboard-financeiro.css']
})

export class DashboardFinanceiro implements OnInit, AfterViewInit  {
ngAfterViewInit(): void {
  this.buildGraficos();
}
  private dashboardService = inject(DashboardFinanceiroService);
private configService = inject(ConfiguracaoFinanceiraService);
  private cdr = inject(ChangeDetectorRef);

  dashboard: DashboardFinanceiroResponse | null = null;

  loading = false;

metaSugerida: number = 0;
metaManual: number = 0;
metaAutomatica: boolean = true;

  anoAtual = new Date().getFullYear();
  mesAtual = new Date().getMonth() + 1;
anos: number[] = [];

meses = [
  { id: 1, nome: 'Janeiro' },
  { id: 2, nome: 'Fevereiro' },
  { id: 3, nome: 'Março' },
  { id: 4, nome: 'Abril' },
  { id: 5, nome: 'Maio' },
  { id: 6, nome: 'Junho' },
  { id: 7, nome: 'Julho' },
  { id: 8, nome: 'Agosto' },
  { id: 9, nome: 'Setembro' },
  { id: 10, nome: 'Outubro' },
  { id: 11, nome: 'Novembro' },
  { id: 12, nome: 'Dezembro' }
];
  private fluxoChart?: Chart;
  private categoriasChart?: Chart;
  private fluxoPrevistoRealizadoChart?: Chart;
  private fluxoProjetadoChart?: Chart;
  private buildFluxoProjetadoChart(): void {

  const fluxo = this.dashboard?.fluxoCaixaProjetado ?? [];

  const labels = fluxo.map(x =>
    new Date(x.data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    })
  );

  const saldo = fluxo.map(x => x.saldoAcumulado);

  const canvas = document.getElementById('fluxoProjetadoChart') as HTMLCanvasElement;

  if (!canvas) return;

  this.fluxoProjetadoChart?.destroy();

  const ctx = canvas.getContext('2d');

  this.fluxoProjetadoChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
datasets: [{
  label: 'Saldo Acumulado',
  data: fluxo.map(x => x.saldoAcumulado),
  borderColor: '#0d6efd',
  backgroundColor: 'rgba(13,110,253,0.1)',
  fill: true,
  tension: 0.4,
  pointRadius: 0,
  borderWidth: 2
}]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        tooltip: {
          callbacks: {
            label: (ctx: any) => {
              const value = ctx.raw;
              return `R$ ${this.formatarMoeda(value)}`;
            }
          }
        }
      },

      scales: {
        y: {
          ticks: {
            callback: (value: any) =>
              'R$ ' + Number(value).toLocaleString('pt-BR')
          }
        }
      }
    }
  });
}
private buildFluxoPrevistoRealizadoChart(): void {

  const fluxo =
    this.dashboard?.fluxoPrevistoRealizado ?? [];

  const labels =
    fluxo.map(x => x.mes);

  const previsto =
    fluxo.map(x => x.previsto);

  const realizado =
    fluxo.map(x => x.realizado);

  const canvas =
    document.getElementById(
      'fluxoPrevistoRealizadoChart'
    ) as HTMLCanvasElement;

  if (!canvas)
    return;

  this.fluxoPrevistoRealizadoChart?.destroy();

  this.fluxoPrevistoRealizadoChart =
    new Chart(canvas, {

      type: 'bar',

      data: {

        labels,

        datasets: [

          {
            label: 'Previsto',
            data: previsto
          },

          {
            label: 'Realizado',
            data: realizado
          }

        ]

      },

      options: {

        responsive: true,

        maintainAspectRatio: false

      }

    });

}
ngOnInit(): void {

  const anoAtual = new Date().getFullYear();

  for (let i = anoAtual - 5; i <= anoAtual + 1; i++) {
    this.anos.push(i);
  }

  this.carregarDashboard();
}

  private carregarDashboard(): void {

    this.loading = true;

    this.dashboardService.getDashboardFinanceiro(this.anoAtual, this.mesAtual)
      .subscribe({
        next: (res) => {

          this.dashboard = res;
            console.log('fluxo projetado:', this.dashboard?.fluxoCaixaProjetado); 
          this.loading = false;

          this.cdr.markForCheck();

          this.buildGraficos();
        },
        error: (err) => {

          console.error('Erro ao carregar dashboard financeiro', err);

          this.loading = false;
          this.dashboard = null;

          this.cdr.markForCheck();
        }
      });
  }

private buildGraficos(): void {

  if (!this.dashboard) return;

  this.buildFluxoCaixaChart();
  this.buildCategoriasChart();
  this.buildFluxoPrevistoRealizadoChart();


    this.buildFluxoProjetadoChart();

}

  // 📈 fluxo de caixa baseado no BACKEND REAL (receitaDespesa)
private buildFluxoCaixaChart(): void {

  const fluxo = this.dashboard?.receitaDespesa ?? [];

  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

  const labels = fluxo.map((x: any) => x.mes);
  const receitas = fluxo.map((x: any) => x.receitas);
  const despesas = fluxo.map((x: any) => x.despesas);

  const canvas = document.getElementById('fluxoCaixaChart') as HTMLCanvasElement;

  if (!canvas) return;

  this.fluxoChart?.destroy();

this.fluxoChart = new Chart(canvas, {
  type: 'bar',
  data: {
    labels,
    datasets: [
      {
        label: 'Receitas',
        data: receitas,
        backgroundColor: '#198754'
      },
      {
        label: 'Despesas',
        data: despesas,
        backgroundColor: '#dc3545'
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false
  }
});
}
pesquisar(): void {
  this.carregarDashboard();
}
  // 🧾 categorias
  private buildCategoriasChart(): void {

    const categorias = this.dashboard?.categorias ?? [];

    const labels = categorias.map(x => x.categoria);
    const values = categorias.map(x => x.valor);

    const canvas = document.getElementById('categoriasChart') as HTMLCanvasElement;

    if (!canvas) return;

    this.categoriasChart?.destroy();

    this.categoriasChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data: values
        }]
      },
      options: {
        maintainAspectRatio: false
      }
    });
  }

  // 💰 saldo REAL vindo do backend
  get saldo(): number {
    return this.dashboard?.saldoMes ?? 0;
  }
  formatarMoeda(valor: number | undefined | null): string {
  return (valor ?? 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
get percentualMetaBarra(): string {

  const percentual =
    this.dashboard?.percentualMeta ?? 0;

  return `${Math.min(percentual, 100)}%`;
}
salvarMetaManual() {

  this.configService.salvarConfiguracao({
    metaMensal: this.metaManual,
    metaAnual: 0
  }).subscribe(() => {

    this.carregarDashboard();

  });

}
}
/*O gráfico de Fluxo de Caixa Projetado representa uma série temporal de 90 dias, baseada no saldo acumulado diário do sistema financeiro.

🎯 Objetivo

Exibir a evolução do caixa ao longo do tempo, permitindo visualizar:

tendência de crescimento ou queda do saldo
pontos onde o caixa pode ficar negativo
comportamento financeiro futuro baseado em projeções do backend
📊 Estrutura dos dados

O gráfico utiliza:

data → eixo temporal (90 dias)
saldoAcumulado → valor principal exibido no gráfico
⚙️ Características atuais
Uma única série (saldo acumulado)
Dados vindos diretamente do backend
Representação contínua (linha)
Sem comparação com outras métricas (ex: realizado vs previsto)
🧠 Observação técnica

Este gráfico prioriza precisão financeira e previsibilidade, e não complexidade visual.
Ele não possui múltiplas séries intencionalmente para manter a leitura clara do fluxo de caixa projetado. */