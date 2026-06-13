export interface BaixaFinanceiraResponse {

  id: string;

  valorPago: number;

  dataBaixa: Date;

  observacao?: string;

  contaReceberId?: string;

  contaPagarId?: string;

  formaPagamentoId: string;

  formaPagamentoNome?: string;

  contaBancariaEmpresaId?: string;

  contaBancariaNome?: string;

  dataCadastro: Date;
}