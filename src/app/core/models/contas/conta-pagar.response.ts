export interface ContaPagarResponse {
  id: string;

  descricao: string;

  valor: number;
  valorPago: number;

  dataVencimento: Date;

  status: number;

  pessoaId: string;
  nomePessoa: string;

  categoriaFinanceiraId?: string;
  categoriaFinanceira?: string;

  centroCustoId?: string;
  nomeCentroCusto?: string;
}