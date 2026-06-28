import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { WebJurPublicacao } from '../../../../../core/models/webjur/web-jur-publicacao';
import { WebJurService } from '../../../../../core/services/webjur.service';





@Component({
  selector: 'app-consultar-webjur',
  standalone: false,
  templateUrl: './consultar-webjur.html',
  styleUrl: './consultar-webjur.css',
})
export class ConsultarWebjur implements OnInit {

  displayedColumns: string[] = [
    'codPublicacao',
    'numeroProcesso',
    'dataPublicacao',
    'varaDescricao',
    'orgaoDescricao',
    'acoes'
  ];

  dataSource = new MatTableDataSource<WebJurPublicacao>([]);
  consulta: WebJurPublicacao[] = [];

  totalRegistros = 0;
  paginaAtual = 1;
  tamanhoPagina = 10;
  totalPaginas = 1;
  paginasVisiveis: number[] = [];

  carregando = false;
  filtro = '';

  mensagemErro: string[] = [];
  mensagemSucesso: string[] = [];

  private webjurService = inject(WebJurService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.carregarPublicacoes();
  }

  aplicarFiltro() {
    this.paginaAtual = 1;
    this.carregarPublicacoes();
  }

  carregarPublicacoes() {

    this.carregando = true;
    this.mensagemErro = [];

    this.webjurService
      .consultarPublicacoesPaginado(this.paginaAtual, this.tamanhoPagina, this.filtro)
      .subscribe({
        next: (response: any) => {

          const items = response.items || [];

          this.consulta = items;
          this.dataSource.data = items;

          this.totalRegistros = response.totalCount || 0;
          this.totalPaginas = Math.ceil(this.totalRegistros / this.tamanhoPagina);

          this.atualizarPaginasVisiveis();

          this.carregando = false;
          this.cdr.detectChanges();
        },

        error: () => {
          this.mensagemErro = ['Erro ao consultar publicações WebJur.'];
          this.carregando = false;
          this.cdr.detectChanges();
        }
      });
  }

  irParaPagina(p: number) {
    if (p < 1 || p > this.totalPaginas) return;

    this.paginaAtual = p;
    this.carregarPublicacoes();
  }

  atualizarPaginasVisiveis() {

    const maxVisiveis = 5;

    let start = Math.max(1, this.paginaAtual - 2);
    let end = Math.min(this.totalPaginas, start + maxVisiveis - 1);

    start = Math.max(1, end - maxVisiveis + 1);

    this.paginasVisiveis = Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );
  }

  importarPublicacoes() {

    this.carregando = true;

    this.webjurService.importarPublicacoes()
      .subscribe({
        next: (res: any) => {
          this.mensagemSucesso = [res?.message ?? 'Importação concluída'];
          this.carregarPublicacoes();
        },
        error: () => {
          this.mensagemErro = ['Erro ao importar publicações'];
          this.carregando = false;
        }
      });
  }

  sincronizarTudo() {

    this.carregando = true;

    this.webjurService.sincronizarTudo()
      .subscribe({
        next: (res: any) => {
          this.mensagemSucesso = [res?.message ?? 'Sincronização concluída'];
          this.carregarPublicacoes();
        },
        error: () => {
          this.mensagemErro = ['Erro ao sincronizar WebJur'];
          this.carregando = false;
        }
      });
  }
}