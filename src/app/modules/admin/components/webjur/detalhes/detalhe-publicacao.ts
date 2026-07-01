import { ChangeDetectorRef, Component, inject, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebJurService } from '../../../../../core/services/webjur.service';
import { WebJurPublicacaoDetalhe } from '../../../../../core/models/webjur/webjur-publicacao-detalhe';
import { finalize } from 'rxjs';
import { ProcessoResumoResponse } from '../../../../../core/models/processo-resumo/processo-resumo-response';
import { ProcessoService } from '../../../../../core/services/processo.service';

@Component({
  selector: 'app-detalhe-publicacao',
  templateUrl: './detalhe-publicacao.html',
  standalone: false,
  styleUrls: ['./detalhe-publicacao.css'],
})
export class DetalhePublicacao implements OnInit {

  // ================== INJEÇÕES ==================
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(WebJurService);
  private processoService = inject(ProcessoService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  // ================== ESTADO ==================
  carregando = false;
  detalhe: WebJurPublicacaoDetalhe | null = null;



  mensagemErro: string[] = [];
  mensagemSucesso: string[] = [];

  comentario = '';
mostrarModalDadosWebJur = false;
  // Modal
  mostrarModalComentarios = false;
  mostrarModalVisualizacoes = false;


carregandoVisualizacoes = false;

visualizacoes: any[] = [];

paginaVisualizacao = 1;
pageSizeVisualizacao = 10;

totalVisualizacoes = 0;
totalVisualizacoesPaginas = 0;

paginasVisualizacaoVisiveis: number[] = [];
processo: ProcessoResumoResponse | null = null;
carregandoProcesso = false;

private carregarProcesso() {

  if (!this.detalhe?.processoId) {
    this.processo = null;
    return;
  }

  this.carregandoProcesso = true;

  this.processoService
      .obterResumoProcesso(this.detalhe.processoId)
      .pipe(
        finalize(() => {

          this.carregandoProcesso = false;
          this.cdr.detectChanges();

        })
      )
      .subscribe({

        next: processo => {

          this.processo = processo;

        },

        error: () => {

          this.processo = null;

        }

      });

}

abrirModalDadosWebJur() {
  this.mostrarModalDadosWebJur = true;
}

fecharModalDadosWebJur() {
  this.mostrarModalDadosWebJur = false;
}
carregarVisualizacoes(page = 1) {

  if (!this.detalhe || this.carregandoVisualizacoes) return;

  this.paginaVisualizacao = page;
  this.carregandoVisualizacoes = true;

  this.service.getVisualizacoes(
    this.detalhe.id,
    page,
    this.pageSizeVisualizacao
  ).subscribe({

    next: (res) => {
      this.visualizacoes = res.items ?? [];
      this.totalVisualizacoes = res.totalCount ?? 0;
    },

    error: () => {
      this.visualizacoes = [];
    },

    complete: () => {
      this.carregandoVisualizacoes = false;
      this.cdr.detectChanges();
    }

  });
}

abrirModalVisualizacoes() {

  if (!this.detalhe) return;

  this.mostrarModalVisualizacoes = true;
  this.paginaVisualizacao = 1;

  this.carregarVisualizacoes(1);
   
}

  // ================== INIT ==================
ngOnInit(): void {

  this.route.paramMap.subscribe(params => {

    const id = params.get('id');

    if (!id) return;

    this.zone.run(() => {

      this.carregar(id);

      this.service.registrarVisualizacao(id).subscribe();
    });
  });
}

  // ================== MODAIS ==================

  abrirComentarios() {
    this.mostrarModalComentarios = true;
  }

  fecharComentarios() {
    this.mostrarModalComentarios = false;
  }



fecharVisualizacoes() {
  this.mostrarModalVisualizacoes = false;
}
fecharModal() {
  this.mostrarModalVisualizacoes = false;
}
  // ================== COMENTÁRIO ==================

 adicionarComentario() {

  if (!this.detalhe) return;

  if (!this.comentario.trim()) return;

  const id = this.detalhe.id;

  this.carregando = true;

  this.service.adicionarComentario(
    id,
    this.comentario
  ).subscribe({

    next: () => {

      this.comentario = '';

      this.carregar(id);

      this.mensagemSucesso = ['Comentário adicionado'];

      this.carregando = false;

    },

    error: (err) => {

      this.mensagemErro = [
        err.error?.mensagem ?? 'Erro ao adicionar comentário'
      ];

      this.carregando = false;

    }

  });

}
gerarPaginas(paginaAtual: number, totalPaginas: number): number[] {

  const paginas: number[] = [];

  const inicio = Math.max(1, paginaAtual - 2);
  const fim = Math.min(totalPaginas, paginaAtual + 2);

  for (let i = inicio; i <= fim; i++) {
    paginas.push(i);
  }

  return paginas;
}
  // ================== CARREGAR DETALHE ==================

  carregar(id: string) {

    this.zone.run(() => {

      this.carregando = true;
      this.detalhe = null;
      this.mensagemErro = [];

      this.service.obterDetalhe(id)
        .pipe(
          finalize(() => {
            this.carregando = false;
            this.cdr.detectChanges();
          })
        )
        .subscribe({

          next: (res) => {
  console.log(res);
            this.detalhe = res;
            if (this.detalhe?.processoId) {
    this.carregarProcesso();
  }
 this.carregarVisualizacoes(1);
            this.cdr.detectChanges();
          },

          error: (err) => {

            this.mensagemErro = [
              err.error?.mensagem ?? 'Erro ao carregar publicação.'
            ];

            this.cdr.detectChanges();
          }

        });
    });
  }

  // ================== SINCRONIZAR ==================

 sincronizar() {

  if (!this.detalhe) return;

  const id = this.detalhe.id;

  this.carregando = true;

  this.service.sincronizarPublicacao(id)
    .subscribe({

      next: () => {

        this.mensagemSucesso = ['Publicação sincronizada.'];

        this.carregar(id);

      },

      error: () => {

        this.mensagemErro = ['Erro ao sincronizar'];

        this.carregando = false;

      }

    });

}

  // ================== PDF ==================

  baixarPdf() {

    if (!this.detalhe) return;

    this.service.baixarPdf(this.detalhe.id)
      .subscribe(blob => {

        const url = window.URL.createObjectURL(blob);

        window.open(url);

      });
  }

  // ================== VOLTAR ==================

  voltar() {
    this.router.navigate(['/webjur']);
  }
getSituacao(status: number): string {

  switch (status) {

    case 1:
      return 'Ativo';

    case 2:
      return 'Suspenso';

    case 3:
      return 'Arquivado';

    case 4:
      return 'Encerrado';

    default:
      return '-';
  }

}

getSituacaoClass(status: number): string {

  switch (status) {

    case 1:
      return 'bg-success';

    case 2:
      return 'bg-warning text-dark';

    case 3:
      return 'bg-secondary';

    case 4:
      return 'bg-dark';

    default:
      return 'bg-light text-dark';
  }

}
}