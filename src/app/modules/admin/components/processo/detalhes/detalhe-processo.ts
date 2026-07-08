import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, forkJoin, of } from 'rxjs';

import { ProcessoService } from '../../../../../core/services/processo.service';
import { AcaoService } from '../../../../../core/services/acao.service';
import { UsuarioService } from '../../../../../core/services/usuario.service';
import { ProcessoPublicacaoWebJurResponse } from '../../../../../core/models/webjur/processo-publicacao-web-jur-response';

@Component({
  selector: 'app-detalhe-processo',
  templateUrl: './detalhe-processo.html',
  standalone: false,
  styleUrls: ['./detalhe-processo.css']
})
export class DetalheProcesso implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private processoService = inject(ProcessoService);
  private acaoService = inject(AcaoService);
  private usuarioService = inject(UsuarioService);
  private cdr = inject(ChangeDetectorRef);

  carregando = false;

  processo: any = null;
  id!: string;

  abaAtiva: 'dados' | 'partes' | 'webjur' | 'complementos' = 'dados';

  acoes: any[] = [];
  usuarios: any[] = [];

  publicacoesWebJur: ProcessoPublicacaoWebJurResponse[] = [];
  carregandoPublicacoesWebJur = false;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;

    console.log('ID PROCESSO:', this.id);

    this.carregar();
  }

  carregar() {
    this.carregando = true;

    forkJoin({
      processo: this.processoService.ObterProcessoPorId(this.id),

      acoes: this.acaoService.consultar().pipe(
        catchError(() => of([]))
      ),

      usuarios: this.usuarioService.consultarUsuarioResponsavel().pipe(
        catchError(() => of([]))
      )
    })
      .pipe(
        finalize(() => {
          this.carregando = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res: any) => {
          console.log('🔥 PROCESSO BACKEND:', res.processo);

          this.processo = res.processo;
          this.acoes = res.acoes ?? [];
          this.usuarios = res.usuarios ?? [];
        },

        error: (err) => {
          console.error('Erro ao carregar processo:', err);
          this.processo = null;
        }
      });
  }

  mudarAba(aba: 'dados' | 'partes' | 'webjur' | 'complementos') {
    this.abaAtiva = aba;

    if (aba === 'webjur' && this.publicacoesWebJur.length === 0) {
      this.carregarPublicacoesWebJur();
    }
  }

  carregarPublicacoesWebJur() {
    if (!this.id) {
      this.publicacoesWebJur = [];
      return;
    }

    this.carregandoPublicacoesWebJur = true;

    this.processoService.obterPublicacoesWebJur(this.id)
      .pipe(
        finalize(() => {
          this.carregandoPublicacoesWebJur = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res) => {
          console.log('Publicações WebJur:', res);
          this.publicacoesWebJur = res ?? [];
        },

        error: (err) => {
          console.error('Erro ao carregar publicações WebJur:', err);
          this.publicacoesWebJur = [];
        }
      });
  }

  voltar() {
    this.router.navigate(['/admin/consultar-processo']);
  }

  get nomeAcao(): string {
    return this.acoes.find(a => a.idAcao === this.processo?.acaoId)?.nomeAcao ?? '-';
  }

  get nomeResponsavel(): string {
    return this.usuarios.find(u => u.id === this.processo?.usuarioResponsavelId)?.nomeUsuario ?? '-';
  }
}