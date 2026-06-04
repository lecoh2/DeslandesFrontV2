import {
  ChangeDetectorRef,
  Component,
  inject,
  NgZone,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  Validators
} from '@angular/forms';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  catchError,
  finalize,
  of
} from 'rxjs';

import { ContaReceberService } from '../../../../../core/services/conta-receber.service';
import { PessoaService } from '../../../../../core/services/pessoa.service';
import { ContratoService } from '../../../../../core/services/contrato.service';
import { CentroCustoService } from '../../../../../core/services/centro-custo.service';
import { CategoriaFinanceiraService } from '../../../../../core/services/categoria-financeira.service';

import { PessoaResumo } from '../../../../../core/models/pessoa/pessoa-resumo';
import { ContratoResponse } from '../../../../../core/models/contrato/contrato-response';
import { CentroCustoResponse } from '../../../../../core/models/centro-custo/centro-custo-response';
import { CategoriaFinanceiraResponse } from '../../../../../core/models/categoria-financeira/categoria-financeira-response';

import { ContaReceberRequest } from '../../../../../core/models/conta-receber/conta-receber-request';

@Component({
  selector: 'app-cadastrar-conta-receber',
  standalone: false,
  templateUrl: './cadastrar-conta-receber.html',
  styleUrl: './cadastrar-conta-receber.css'
})
export class CadastrarContaReceber implements OnInit {

  private builder = inject(FormBuilder);

  private contaReceberService = inject(ContaReceberService);
  private pessoaService = inject(PessoaService);
  private contratoService = inject(ContratoService);
  private centroCustoService = inject(CentroCustoService);
  private categoriaFinanceiraService = inject(CategoriaFinanceiraService);

  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  carregando = false;

  mensagemErro: string[] = [];
  mensagemSucesso: string[] = [];

  clientesFiltrados: PessoaResumo[] = [];
  clienteSelecionado?: PessoaResumo;

  contratos: ContratoResponse[] = [];
  categorias: CategoriaFinanceiraResponse[] = [];
  centrosCusto: CentroCustoResponse[] = [];

  form = this.builder.group({

    descricao: [
      '',
      [
        Validators.required,
        Validators.maxLength(250)
      ]
    ],

    valor: [
      0,
      Validators.required
    ],

    dataVencimento: [
      '',
      Validators.required
    ],

    contratoId: [''],

    categoriaFinanceiraId: [''],

    centroCustoId: ['']

  });

  ngOnInit(): void {

    this.carregarContratos();
    this.carregarCategorias();
    this.carregarCentrosCusto();

  }

  get podeEnviar(): boolean {

    return (
      this.form.valid &&
      this.clienteSelecionado != null &&
      !this.carregando
    );

  }

  // ===================================
  // CLIENTE
  // ===================================

  buscarClientes(nome: string) {

    this.pessoaService
      .consultarPessoasResumo(nome)
      .pipe(
        catchError(() => of([]))
      )
      .subscribe(res => {

        this.clientesFiltrados = res;

      });

  }

  // ===================================
  // CONTRATOS
  // ===================================

  carregarContratos() {

    this.contratoService
      .consultarContratos()
      .pipe(
        catchError(() => of([]))
      )
      .subscribe(res => {

        this.contratos = res;

      });

  }

  // ===================================
  // CATEGORIAS
  // ===================================

  carregarCategorias() {

    this.categoriaFinanceiraService
      .consultarCategoriaFinanceira()
      .pipe(
        catchError(() => of([]))
      )
      .subscribe(res => {

        this.categorias = res;

      });

  }

  // ===================================
  // CENTROS DE CUSTO
  // ===================================

  carregarCentrosCusto() {

    this.centroCustoService
      .consultarCentroCusto()
      .pipe(
        catchError(() => of([]))
      )
      .subscribe(res => {

        this.centrosCusto = res;

      });

  }

  // ===================================
  // SUBMIT
  // ===================================

  onSubmit(): void {

    this.mensagemErro = [];
    this.mensagemSucesso = [];

    if (this.form.invalid) {

      this.form.markAllAsTouched();
      return;

    }

    if (!this.clienteSelecionado) {

      this.mensagemErro = [
        'Selecione um cliente.'
      ];

      return;

    }

    this.zone.run(() => {

      this.carregando = true;
      this.cdr.detectChanges();

    });

    const request: ContaReceberRequest = {

      descricao: this.form.value.descricao!,

      valor: Number(this.form.value.valor),

      dataVencimento: new Date(
        this.form.value.dataVencimento!
      ),

      pessoaId: this.clienteSelecionado.id,

      contratoId:
        this.form.value.contratoId || undefined,

      categoriaFinanceiraId:
        this.form.value.categoriaFinanceiraId || undefined,

      centroCustoId:
        this.form.value.centroCustoId || undefined

    };

    this.contaReceberService
      .cadastrarContaReceber(request)
      .pipe(
        finalize(() => {

          this.zone.run(() => {

            this.carregando = false;
            this.cdr.detectChanges();

          });

        })
      )
      .subscribe({

        next: (res: any) => {

          this.zone.run(() => {

            this.resetar();

            this.mensagemSucesso = [
              res?.message ??
              'Conta a receber cadastrada com sucesso.'
            ];

            this.cdr.detectChanges();

          });

        },

        error: (err: HttpErrorResponse) => {

          this.zone.run(() => {

            const e = err?.error;

            this.mensagemErro = [];

            if (e?.errors) {

              for (const key in e.errors) {

                this.mensagemErro.push(
                  ...e.errors[key]
                );

              }

            }
            else if (e?.message) {

              this.mensagemErro.push(
                e.message
              );

            }
            else {

              this.mensagemErro.push(
                'Erro ao cadastrar conta a receber.'
              );

            }

            this.carregando = false;

            this.cdr.detectChanges();

          });

        }

      });

  }

  // ===================================
  // MOEDA
  // ===================================

  onMoneyInput(event: any) {

    let value =
      event.target.value.replace(/\D/g, '');

    if (!value) {

      this.form
        .get('valor')
        ?.setValue(0, {
          emitEvent: false
        });

      return;

    }

    const numericValue = Number(value);

    const formatted =
      new Intl.NumberFormat(
        'en-US',
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      ).format(numericValue / 100);

    this.form
      .get('valor')
      ?.setValue(
        numericValue / 100,
        {
          emitEvent: false
        }
      );

    event.target.value = formatted;

  }

  // ===================================
  // RESET
  // ===================================

  private resetar() {

    this.form.reset({

      valor: 0

    });

    this.clienteSelecionado = undefined;
    this.clientesFiltrados = [];

  }

}