
export interface ContaPagarRequest {
  descricao: string;

  valor: number;

  dataVencimento: Date;

  pessoaId: string;

  categoriaFinanceiraId?: string;

  centroCustoId?: string;
}