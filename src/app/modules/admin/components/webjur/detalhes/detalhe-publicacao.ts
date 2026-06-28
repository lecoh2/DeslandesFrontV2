import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { WebJurPublicacaoDetalhe } from '../../../../../core/models/webjur/webjur-publicacao-detalhe';
import { WebJurService } from '../../../../../core/services/webjur.service';


@Component({
  selector: 'app-detalhe-publicacao',
  templateUrl: './detalhe-publicacao.html',
  standalone: false,
  styleUrls: ['./detalhe-publicacao.css'],
})
export class DetalhePublicacao implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(WebJurService);

  carregando = false;

  detalhe!: WebJurPublicacaoDetalhe;

  comentario = '';

  mensagemErro: string[] = [];

  mensagemSucesso: string[] = [];
  adicionarComentario(): void {

    if (!this.comentario.trim())
      return;

    console.log(this.comentario);

    this.comentario = '';

  }
  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id)
      return;

    this.carregar(id);

    this.service.registrarVisualizacao(id)
      .subscribe();

  }

  carregar(id: string) {

    this.carregando = true;

    this.service
      .obterDetalhe(id)
      .pipe(
        finalize(() => this.carregando = false)
      )
      .subscribe({

        next: response => {

          this.detalhe = response;

        },

        error: err => {

          this.mensagemErro = [
            err.error?.mensagem ??
            'Erro ao carregar publicação.'
          ];

        }

      });

  }

  voltar() {

    this.router.navigate(['/webjur']);

  }

  sincronizar() {

    this.service
      .sincronizarPublicacao(this.detalhe.id)
      .subscribe({

        next: () => {

          this.mensagemSucesso = [
            'Publicação sincronizada.'
          ];

          this.carregar(this.detalhe.id);

        }

      });

  }

  comentar() {

    if (!this.comentario.trim())
      return;

    this.service
      .adicionarComentario(
        this.detalhe.id,
        this.comentario
      )
      .subscribe({

        next: () => {

          this.comentario = '';

          this.carregar(this.detalhe.id);

        }

      });

  }

  baixarPdf() {

    this.service
      .baixarPdf(this.detalhe.id)
      .subscribe(blob => {

        const url = window.URL.createObjectURL(blob);

        window.open(url);

      });

  }

}