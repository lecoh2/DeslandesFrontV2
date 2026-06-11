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


import { PessoaService } from '../../../../../core/services/pessoa.service';
import { CentroCustoService } from '../../../../../core/services/centro-custo.service';
import { CategoriaFinanceiraService } from '../../../../../core/services/categoria-financeira.service';

import { PessoaResumo } from '../../../../../core/models/pessoa/pessoa-resumo';
import { CentroCustoResponse } from '../../../../../core/models/centro-custo/centro-custo-response';
import { CategoriaFinanceiraResponse } from '../../../../../core/models/categoria-financeira/categoria-financeira-response';

import { ContaPagarRequest } from '../../../../../core/models/contas/conta-pagar-request';
import { ContaPagarService } from '../../../../../core/services/conta-paga.service';

@Component({
  selector: 'app-cadastrar-conta-pagar',
  standalone: false,
  templateUrl: './cadastrar-conta-pagar.html',
  styleUrl: './cadastrar-conta-pagar.css'
})
export class CadastrarContaPagar implements OnInit {

  private builder = inject(FormBuilder);

  private contaPagarService = inject(ContaPagarService);
  private pessoaService = inject(PessoaService);
  private centroCustoService = inject(CentroCustoService);
  private categoriaFinanceiraService = inject(CategoriaFinanceiraService);

  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  carregando = false;

  mensagemErro: string[] = [];
  mensagemSucesso: string[] = [];

  fornecedoresFiltrados: PessoaResumo[] = [];
  fornecedorSelecionado?: PessoaResumo;

  categorias: CategoriaFinanceiraResponse[] = [];
  centrosCusto: CentroCustoResponse[] = [];

  form = this.builder.group({
    descricao: ['', Validators.required],
    valor: [0, Validators.required],
    dataVencimento: ['', Validators.required],

    pessoaId: [''],
    categoriaFinanceiraId: [null],
    centroCustoId: [null]
  });
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

  ngOnInit(): void {
    this.carregarCategorias();
    this.carregarCentrosCusto();
  }

  // =========================
  // BUSCA FORNECEDOR
  // =========================
  buscarFornecedores(nome: string) {
    this.pessoaService
      .consultarPessoasResumo(nome)
      .pipe(catchError(() => of([])))
      .subscribe(res => {
        this.fornecedoresFiltrados = res;
      });
  }

  // =========================
  // CATEGORIAS
  // =========================
  carregarCategorias() {
    this.categoriaFinanceiraService
      .consultarCategoriaFinanceira()
      .pipe(catchError(() => of([])))
      .subscribe(res => this.categorias = res);
  }

  // =========================
  // CENTRO DE CUSTO
  // =========================
  carregarCentrosCusto() {
    this.centroCustoService
      .consultarCentroCusto()
      .pipe(catchError(() => of([])))
      .subscribe(res => this.centrosCusto = res);
  }

  // =========================
  // SUBMIT
  // =========================
  onSubmit(): void {

    this.mensagemErro = [];
    this.mensagemSucesso = [];

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.fornecedorSelecionado) {
      this.mensagemErro = ['Selecione um fornecedor.'];
      return;
    }

    this.zone.run(() => {
      this.carregando = true;
      this.cdr.detectChanges();
    });

    const request: ContaPagarRequest = {
      descricao: this.form.value.descricao?.trim() ?? '',
      valor: Number(this.form.value.valor),
      dataVencimento: new Date(this.form.value.dataVencimento!),
      pessoaId: this.fornecedorSelecionado.id,
      categoriaFinanceiraId: this.form.value.categoriaFinanceiraId || undefined,
      centroCustoId: this.form.value.centroCustoId || undefined
    };

    this.contaPagarService
      .cadastrarContaPagar(request)
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
              res?.message ?? 'Conta a pagar cadastrada com sucesso.'
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
                this.mensagemErro.push(...e.errors[key]);
              }
            }
            else if (e?.message) {
              this.mensagemErro.push(e.message);
            }
            else {
              this.mensagemErro.push('Erro ao cadastrar conta a pagar.');
            }

            this.carregando = false;
            this.cdr.detectChanges();

          });

        }

      });
  }

  // =========================
  // RESET
  // =========================
  private resetar() {
    this.form.reset({
      valor: 0
    });

    this.fornecedorSelecionado = undefined;
    this.fornecedoresFiltrados = [];
  }
}