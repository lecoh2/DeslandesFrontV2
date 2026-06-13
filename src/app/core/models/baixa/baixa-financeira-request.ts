export interface BaixaFinanceiraRequest {

  contaReceberId?: string;

  contaPagarId?: string;

  valorPago: number;

  dataBaixa: Date;

  formaPagamentoId: string;

  formaPagamento: number;

  observacao?: string;

  contaBancariaEmpresaId?: string;
}