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
  catchError,
  finalize,
  of
} from 'rxjs';


import { PessoaService } from '../../../../../core/services/pessoa.service';
import { CategoriaFinanceiraService } from '../../../../../core/services/categoria-financeira.service';
import { CentroCustoService } from '../../../../../core/services/centro-custo.service';

import { PessoaResumo } from '../../../../../core/models/pessoa/pessoa-resumo';
import { CategoriaFinanceiraResponse } from '../../../../../core/models/categoria-financeira/categoria-financeira-response';
import { CentroCustoResponse } from '../../../../../core/models/centro-custo/centro-custo-response';
import { ContaPagarRequest } from '../../../../../core/models/contas/conta-pagar-request';
import { ContaPagarService } from '../../../../../core/services/conta-paga.service';
import { ContratoService } from '../../../../../core/services/contrato.service';

@Component({
  selector: 'app-cadastrar-conta-pagar',
  templateUrl: './cadastrar-conta-pagar.html',
  standalone:false,
  styleUrl: './cadastrar-conta-pagar.css'
})
export class CadastrarContaPagar implements OnInit {

  private builder = inject(FormBuilder);
  private service = inject(ContaPagarService);
  private pessoaService = inject(PessoaService);
  private categoriaService = inject(CategoriaFinanceiraService);

 private contratoService = inject(ContratoService);
 private centroCustoService = inject(CentroCustoService);
private categoriaFinanceiraService = inject(CategoriaFinanceiraService);

  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  centrosCusto: CentroCustoResponse[] = [];
  carregando = false;

  mensagemErro: string[] = [];
  mensagemSucesso: string[] = [];

  fornecedoresFiltrados: PessoaResumo[] = [];
  fornecedorSelecionado?: PessoaResumo;

  categorias: CategoriaFinanceiraResponse[] = [];
  centros: CentroCustoResponse[] = [];

  form = this.builder.group({

    descricao: ['', Validators.required],
    valor: [0, Validators.required],
    dataVencimento: ['', Validators.required],

    categoriaFinanceiraId: [null],
    centroCustoId: [null],
    contratoId: [null],

    parcelado: [false],
    quantidadeParcelas: this.builder.control<number | null>(null),

  });
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
  ngOnInit(): void {

    this.carregarCategorias();
    this.carregarCentrosCusto();

    this.form.get('parcelado')?.valueChanges.subscribe(parcelado => {

      if (parcelado) {
        this.form.patchValue({ quantidadeParcelas: 2 });
      } else {
        this.form.patchValue({ quantidadeParcelas: null });
      }

    });

  }

  // =========================
  // VALIDAÇÃO
  // =========================
  get podeEnviar(): boolean {

    const parcelado = this.form.get('parcelado')?.value;
    const parcelas = this.form.get('quantidadeParcelas')?.value;

    if (parcelado && (!parcelas || parcelas <= 1))
      return false;

    return this.form.valid && !this.carregando;
  }

  // =========================
  // FORNECEDOR
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

    this.categoriaService
      .consultarCategoriaFinanceira()
      .pipe(catchError(() => of([])))
      .subscribe(res => {
        this.categorias = res;
      });

  }

  // =========================
  // CENTROS
  // =========================
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
      descricao: this.form.value.descricao!,
      valor: Number(this.form.value.valor),
      dataVencimento: new Date(this.form.value.dataVencimento!),

      pessoaId: this.fornecedorSelecionado.id,

      categoriaFinanceiraId: this.form.value.categoriaFinanceiraId || undefined,
      centroCustoId: this.form.value.centroCustoId || undefined,
      contratoId: this.form.value.contratoId || undefined,

      parcelado: this.form.value.parcelado ?? false,
      quantidadeParcelas: this.form.value.parcelado
        ? Number(this.form.value.quantidadeParcelas)
        : undefined
    };

    this.service
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

        next: () => {

          this.zone.run(() => {

            this.resetar();

            this.mensagemSucesso = [
              'Conta a pagar cadastrada com sucesso.'
            ];

            this.cdr.detectChanges();

          });

        },

        error: () => {

          this.zone.run(() => {

            this.mensagemErro = [
              'Erro ao cadastrar conta a pagar.'
            ];

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
      valor: 0,
      parcelado: false,
      quantidadeParcelas: null
    });

    this.fornecedorSelecionado = undefined;
    this.fornecedoresFiltrados = [];
  }

  // =========================
  // SIMULAÇÃO PARCELAS
  // =========================
  get simulacaoParcelas() {

    const valor = Number(this.form.get('valor')?.value ?? 0);
    const qtd = Number(this.form.get('quantidadeParcelas')?.value ?? 1);
    const data = this.form.get('dataVencimento')?.value;

    if (!data || qtd <= 0) return [];

    const valorParcela = Number((valor / qtd).toFixed(2));

    const parcelas = [];

    for (let i = 0; i < qtd; i++) {

      const venc = new Date(data);
      venc.setMonth(venc.getMonth() + i);

      parcelas.push({
        numero: i + 1,
        valor: valorParcela,
        vencimento: venc
      });

    }

    return parcelas;
  }

  get valorParcela(): string {

    const valor = Number(this.form.get('valor')?.value ?? 0);
    const qtd = Number(this.form.get('quantidadeParcelas')?.value ?? 1);

    const result = qtd > 0 ? valor / qtd : valor;

    return result.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

  }
}