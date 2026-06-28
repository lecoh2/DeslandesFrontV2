import {
  Component,
  inject,
  NgZone,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';


import { WebJurPublicacao } from '../../../../core/models/webjur/web-jur-publicacao';
import { PageResult } from '../../../../core/models/page-result/page-result';
import { WebJurService } from '../../../../core/services/webjur.service';


@Component({
  selector: 'app-publicacoes',
  standalone:false,
  templateUrl: './publicacoes.html',
  styleUrl: './publicacoes.css'
})
export class Publicacoes implements OnInit {

  // ================= DEPENDÊNCIAS =================
  private webjurService = inject(WebJurService);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  // ================= DADOS =================
  publicacoes: WebJurPublicacao[] = [];

  // ================= PAGINAÇÃO =================
  pageNumber = 1;
  pageSize = 10;
  searchTerm = '';

  totalCount = 0;
  totalPages = 0;
  paginasVisiveis: number[] = [];

  // ================= ESTADO =================
  carregando = false;
  mensagemErro: string[] = [];
  mensagemSucesso: string[] = [];

  ngOnInit(): void {
    this.carregarPublicacoes();
  }

  // ================= CARREGAR =================
  carregarPublicacoes(): void {

    this.carregando = true;
    this.mensagemErro = [];

    this.webjurService
      .consultarPublicacoesPaginado(
        this.pageNumber,
        this.pageSize,
        this.searchTerm
      )
      .subscribe({
        next: (res: PageResult<WebJurPublicacao>) => {

          const items = res?.items ?? [];

          this.publicacoes = items;
          this.totalCount = res?.totalCount ?? 0;

          this.totalPages = Math.ceil(
            this.totalCount / this.pageSize
          );

          this.atualizarPaginasVisiveis();

          this.carregando = false;
          this.cdr.detectChanges();
        },

        error: () => {

          this.zone.run(() => {
            this.mensagemErro = ['Erro ao carregar publicações'];
            this.carregando = false;
            this.cdr.detectChanges();
          });

        }
      });
  }

  // ================= PAGINAÇÃO =================
  paginaAlterada(page: number): void {

    if (page < 1 || page > this.totalPages) return;

    this.pageNumber = page;
    this.carregarPublicacoes();
  }

  atualizarPaginasVisiveis(): void {

    const maxVisiveis = 5;

    let start = Math.max(1, this.pageNumber - 2);
    let end = Math.min(this.totalPages, start + maxVisiveis - 1);

    start = Math.max(1, end - maxVisiveis + 1);

    this.paginasVisiveis = Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );
  }

  // ================= BUSCA =================
  buscar(): void {
    this.pageNumber = 1;
    this.carregarPublicacoes();
  }

  // ================= AÇÕES =================
  importar(): void {

    this.carregando = true;

    this.webjurService.importarPublicacoes()
      .subscribe({
        next: () => {
          this.carregarPublicacoes();
        },
        error: () => {
          this.mensagemErro = ['Erro ao importar publicações'];
          this.carregando = false;
        }
      });
  }

  sincronizar(): void {

    this.carregando = true;

    this.webjurService.sincronizarTudo()
      .subscribe({
        next: () => {
          this.carregarPublicacoes();
        },
        error: () => {
          this.mensagemErro = ['Erro ao sincronizar WebJur'];
          this.carregando = false;
        }
      });
  }
}