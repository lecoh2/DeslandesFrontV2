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
}

export interface ContaPagarRequest {
  descricao: string;
  valor: number;
  dataVencimento: Date;

  pessoaId: string;

  categoriaFinanceiraId?: string;
}