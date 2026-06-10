import { ContaReceberBaixaResponse } from "./conta-receber-baixar-response";

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
    baixas: ContaReceberBaixaResponse[];
}