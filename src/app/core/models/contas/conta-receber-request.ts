export interface ContaReceberRequest {
  descricao: string;

  valor: number;

  dataVencimento: Date;

  pessoaId: string;

  contratoId?: string;

  categoriaFinanceiraId?: string;

  centroCustoId?: string;

  tipoConta: number;

  parcelado: boolean;

  quantidadeParcelas?: number;
  formaRecebimento: number;
}