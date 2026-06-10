export interface BaixaFinanceiraResponse {

  id: string;

  valorPago: number;

  dataBaixa: Date;

  observacao?: string;

  formaPagamento: string;

  cliente: string;
}