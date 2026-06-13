import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { FormaRecebimento } from '../../../../../core/models/enums/conta/forma-recebimentoEnum';
import { ContaPagarService } from '../../../../../core/services/conta-paga.service';
import { ContaPagarBaixaRequest } from '../../../../../core/models/contas/conta-pagar-baixa-request';
import { BaixaFinanceiraRequest } from '../../../../../core/models/baixa/baixa-financeira-request';



@Component({
  selector: 'app-visualizar-conta-pagar',
  standalone: false,
  templateUrl: './visualizar-conta-pagar.html',
  styleUrl: './visualizar-conta-pagar.css'
})
export class VisualizarContaPagar implements OnInit {

  conta: any = null;
  contaSelecionadaId: string = '';

  carregando = false;
  salvandoBaixa = false;

  mensagemErro: string[] = [];
  mensagemSucesso: string[] = [];

  mostrarModalBaixa = false;

  formaRecebimentoEnum = FormaRecebimento;

  private route = inject(ActivatedRoute);
  private contaService = inject(ContaPagarService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {

      this.mensagemErro = [
        'Identificador da conta não informado.'
      ];

      return;
    }

    this.carregarConta(id);
  }

  get saldo(): number {

    return (this.conta?.valor ?? 0)
      - (this.conta?.valorPago ?? 0);
  }

  formatarContrato(numero?: string): string {

    if (!numero) {
      return '';
    }

    if (numero.length === 9) {
      return `CTR: ${numero.substring(0, 5)}-${numero.substring(5)}`;
    }

    return `CTR: ${numero}`;
  }

  carregarConta(id: string): void {

    this.carregando = true;

    this.contaService
      .obterContaPagarPorId(id)
      .subscribe({

        next: (response) => {

          this.conta = response;

          this.carregando = false;

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(error);

          this.mensagemErro = [
            'Não foi possível carregar a conta a pagar.'
          ];

          this.carregando = false;

          this.cdr.detectChanges();
        }
      });
  }

  getFormaRecebimento(
    forma: number
  ): string {

    switch (forma) {

      case FormaRecebimento.Dinheiro:
        return 'Dinheiro';

      case FormaRecebimento.Pix:
        return 'PIX';

      case FormaRecebimento.CartaoCredito:
        return 'Cartão de Crédito';

      case FormaRecebimento.CartaoDebito:
        return 'Cartão de Débito';

      case FormaRecebimento.Transferencia:
        return 'Transferência';

      case FormaRecebimento.Boleto:
        return 'Boleto';

      default:
        return 'Não informado';
    }
  }

  getFormaRecebimentoIcon(
    tipo: FormaRecebimento
  ): string {

    switch (tipo) {

      case FormaRecebimento.Pix:
        return 'fas fa-qrcode text-primary';

      case FormaRecebimento.CartaoCredito:
        return 'fas fa-credit-card text-success';

      case FormaRecebimento.CartaoDebito:
        return 'fas fa-credit-card text-info';

      case FormaRecebimento.Dinheiro:
        return 'fas fa-money-bill-wave text-success';

      case FormaRecebimento.Boleto:
        return 'fas fa-barcode text-warning';

      case FormaRecebimento.Transferencia:
        return 'fas fa-exchange-alt text-secondary';

      default:
        return 'fas fa-wallet';
    }
  }

baixa: BaixaFinanceiraRequest = {
  valorPago: 0,
  dataBaixa: new Date(),
  formaPagamentoId: '',
  formaPagamento: FormaRecebimento.Pix,
  observacao: ''
};

  abrirModalBaixa(
  contaId: string,
  valor: number
): void {

  this.mensagemErro = [];
  this.mensagemSucesso = [];

  this.contaSelecionadaId = contaId;

  this.baixa = {
    contaReceberId: '',
    valorPago: valor, // <-- usa o valor recebido
    dataBaixa: new Date(),
    formaPagamentoId: '',
    formaPagamento: FormaRecebimento.Pix,
    observacao: ''
  };

  this.mostrarModalBaixa = true;
}

  confirmarBaixa(): void {

    this.salvandoBaixa = true;

    this.contaService
      .baixarContaPagar(
        this.contaSelecionadaId,
        this.baixa
      )
      .subscribe({

        next: (response: any) => {

          this.mensagemSucesso = [
            response?.message ??
            'Baixa realizada com sucesso.'
          ];

          this.fecharModalBaixa();

          this.salvandoBaixa = false;

          this.carregarConta(this.conta.id);
        },

        error: (err) => {

          this.salvandoBaixa = false;

          this.tratarErro(err);
        }
      });
  }

  fecharModalBaixa(): void {

    this.mostrarModalBaixa = false;

  this.baixa = {
  contaReceberId: '',
  valorPago: 0,
  dataBaixa: new Date(),
  formaPagamentoId: '',
  formaPagamento: FormaRecebimento.Pix,
  observacao: ''
};

    this.contaSelecionadaId = '';

    this.cdr.detectChanges();
  }

  testarParcela(parcela: any): void {
    console.log('PARCELA', parcela);
  }

  private tratarErro(err: any): void {

    this.mensagemErro = [];

    const e = err?.error;

    if (e?.errors) {

      for (const key in e.errors) {
        this.mensagemErro.push(...e.errors[key]);
      }
    }
    else if (e?.mensagem) {

      this.mensagemErro.push(e.mensagem);
    }
    else if (e?.message) {

      this.mensagemErro.push(e.message);
    }
    else {

      this.mensagemErro.push(
        'Erro inesperado ao realizar a baixa.'
      );
    }

    this.carregando = false;

    console.error('ERRO BACKEND:', e);

    this.cdr.detectChanges();
  }
}