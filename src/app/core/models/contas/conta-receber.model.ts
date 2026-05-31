export interface ContaReceberResponse {
  id: string;
  descricao: string;
  valor: number;
  valorPago: number;
  dataVencimento: Date;
  status: number;

  pessoaId: string;
  nomePessoa: string;

  contratoId?: string;
  numeroContrato?: string;

  categoriaFinanceiraId?: string;
  categoriaFinanceira?: string;
}
export interface ContaReceberRequest {
  descricao: string;
  valor: number;
  dataVencimento: Date;

  pessoaId: string;
  contratoId?: string;

  categoriaFinanceiraId?: string;
}