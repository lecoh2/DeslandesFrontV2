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

import { HttpErrorResponse } from '@angular/common/http';

import { ContaReceberService } from '../../../../../core/services/conta-receber.service';
import { PessoaService } from '../../../../../core/services/pessoa.service';
import { ContratoService } from '../../../../../core/services/contrato.service';
import { CentroCustoService } from '../../../../../core/services/centro-custo.service';
import { CategoriaFinanceiraService } from '../../../../../core/services/categoria-financeira.service';

import { PessoaResumo } from '../../../../../core/models/pessoa/pessoa-resumo';
import { ContratoResponse } from '../../../../../core/models/contrato/contrato-response';
import { CentroCustoResponse } from '../../../../../core/models/centro-custo/centro-custo-response';
import { CategoriaFinanceiraResponse } from '../../../../../core/models/categoria-financeira/categoria-financeira-response';

import { TipoContaReceber } from '../../../../../core/models/enums/conta/tipo-conta-receberEnum';
import { FormaRecebimento } from '../../../../../core/models/enums/conta/forma-recebimentoEnum';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-conta-receber',
  standalone: false,
  templateUrl: './editar-conta-receber.html',
  styleUrl: './editar-conta-receber.css'
})
export class EditarContaReceber implements OnInit {

  private builder = inject(FormBuilder);
  private contaReceberService = inject(ContaReceberService);
  private contratoService = inject(ContratoService);
  private centroCustoService = inject(CentroCustoService);
  private categoriaFinanceiraService = inject(CategoriaFinanceiraService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  id!: string;

  carregando = false;
  bloquearParcelamento = false;

  mensagemErro: string[] = [];
  mensagemSucesso: string[] = [];

  clienteSelecionado?: PessoaResumo;

  contratos: ContratoResponse[] = [];
  categorias: CategoriaFinanceiraResponse[] = [];
  centrosCusto: CentroCustoResponse[] = [];

  FormaRecebimentoEnum = FormaRecebimento;

  tiposConta = [
    { value: TipoContaReceber.Mensalidade, descricao: 'Mensalidade' },
    { value: TipoContaReceber.Honorario, descricao: 'Honorários' },
    { value: TipoContaReceber.Contrato, descricao: 'Contrato' },
    { value: TipoContaReceber.Taxa, descricao: 'Taxa' },
    { value: TipoContaReceber.Outro, descricao: 'Outro' }
  ];

  formasRecebimento = [
    { value: FormaRecebimento.Pix, descricao: 'PIX' },
    { value: FormaRecebimento.Boleto, descricao: 'Boleto' },
    { value: FormaRecebimento.CartaoCredito, descricao: 'Cartão de Crédito' },
    { value: FormaRecebimento.CartaoDebito, descricao: 'Cartão de Débito' },
    { value: FormaRecebimento.Transferencia, descricao: 'Transferência' },
    { value: FormaRecebimento.Dinheiro, descricao: 'Dinheiro' }
  ];

  form = this.builder.group({
    descricao: ['', Validators.required],
    valor: [0, Validators.required],
    dataVencimento: ['', Validators.required],

    pessoaId: [''],
    contratoId: [null],
    categoriaFinanceiraId: [null],
    centroCustoId: [null],

    tipoConta: [TipoContaReceber.Contrato, Validators.required],
    formaRecebimento: [FormaRecebimento.Pix, Validators.required],

    parcelado: [false],
    quantidadeParcelas: [null as number | null]
  });

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.carregarContratos();
    this.carregarCategorias();
    this.carregarCentrosCusto();
    this.carregarConta();
  }

  carregarConta(): void {

    this.carregando = true;

    this.contaReceberService
      .obterContaReceberPorId(this.id)
      .pipe(finalize(() => {
        this.carregando = false;
        this.cdr.detectChanges();
      }))
      .subscribe({

        next: (response: any) => {

          this.form.patchValue({
            descricao: response.descricao,
          
            
          });  this.form.get('valor')?.disable();
                    this.form.get('dataVencimento')?.disable();
                    this.form.get('pessoaId')?.disable();
                    this.form.get('contratoId')?.disable();
                    this.form.get('categoriaFinanceiraId')?.disable();
                    this.form.get('centroCustoId')?.disable();
                    this.form.get('tipoConta')?.disable();
                    this.form.get('formaRecebimento')?.disable();
                    this.form.get('parcelado')?.disable();
                    this.form.get('quantidadeParcelas')?.disable();
                    this.form.get('pessoaId')?.setValue(response.pessoaId);
                    this.form.get('descricao')?.enable();

          this.form.get('pessoaId')?.setValue(response.pessoaId);

          this.clienteSelecionado = {
            id: response.pessoaId,
            nome: response.cliente,
            documento: '',
            tipo: 'Juridica'
          };

          this.bloquearParcelamento =
            (response.valorPago ?? 0) > 0 ||
            (response.parcelas?.length ?? 0) > 0;

          if (this.bloquearParcelamento) {
            this.form.get('parcelado')?.disable({ emitEvent: false });
            this.form.get('quantidadeParcelas')?.disable({ emitEvent: false });
          }

          this.cdr.detectChanges();
        },

        error: () => {
          this.mensagemErro = ['Erro ao carregar conta.'];
        }
      });
  }

get podeEnviar(): boolean {
  const descricaoOk = this.form.get('descricao')?.valid ?? false;
  return descricaoOk && !this.carregando;
}
  carregarContratos() {
    this.contratoService.consultarContratos()
      .pipe(catchError(() => of([])))
      .subscribe(r => this.contratos = r);
  }

  carregarCategorias() {
    this.categoriaFinanceiraService.consultarCategoriaFinanceira()
      .pipe(catchError(() => of([])))
      .subscribe(r => this.categorias = r);
  }

  carregarCentrosCusto() {
    this.centroCustoService.consultarCentroCusto()
      .pipe(catchError(() => of([])))
      .subscribe(r => this.centrosCusto = r);
  }

  onMoneyInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');

    if (!value) {
      this.form.get('valor')?.setValue(0, { emitEvent: false });
      return;
    }

    const numeric = Number(value);

    this.form.get('valor')?.setValue(numeric / 100, { emitEvent: false });

    event.target.value =
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(numeric / 100);
  }

  get valorParcela(): string {
    const valor = Number(this.form.get('valor')?.value ?? 0);
    const qtd = Number(this.form.get('quantidadeParcelas')?.value ?? 1);

    return (qtd > 0 ? valor / qtd : valor)
      .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  onSubmit(): void {

    this.mensagemErro = [];
    this.mensagemSucesso = [];

    if (this.form.invalid || !this.clienteSelecionado) return;

    this.carregando = true;

    const request = {
      descricao: this.form.value.descricao,
     /* valor: Number(this.form.value.valor),
      dataVencimento: new Date(this.form.value.dataVencimento!),
      pessoaId: this.clienteSelecionado.id,
      contratoId: this.form.value.contratoId,
      categoriaFinanceiraId: this.form.value.categoriaFinanceiraId,
      centroCustoId: this.form.value.centroCustoId,
      tipoConta: Number(this.form.value.tipoConta),
      formaRecebimento: Number(this.form.value.formaRecebimento)*/
    };

    this.contaReceberService.editarContaReceber(this.id, request)
      .pipe(finalize(() => {
        this.carregando = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (res: any) => {
          this.mensagemSucesso = [res?.message ?? 'Atualizado com sucesso'];
        },
        error: (err: HttpErrorResponse) => {
          this.mensagemErro = [err?.error?.message ?? 'Erro ao atualizar'];
        }
      });
  }excluirConta(): void {

  const confirmar = confirm(
    'Deseja realmente excluir esta conta?'
  );

  if (!confirmar) {
    return;
  }

  this.carregando = true;

  this.contaReceberService
    .excluirContaReceber(this.id)
    .pipe(
      finalize(() => {
        this.carregando = false;
        this.cdr.detectChanges();
      })
    )
    .subscribe({

      next: () => {

        alert('Conta excluída com sucesso.');

        history.back();

      },

      error: (err: HttpErrorResponse) => {

        this.mensagemErro = [
          err?.error?.message ??
          'Erro ao excluir conta.'
        ];

      }

    });

}
}