export interface ContratoResponse {

  id: string;

  numero: string;

  pessoaId: string;

  nomePessoa: string;

  valorTotal: number;

  dataInicio: string;

  dataFim?: string;

  processos: {
    id: string;
    numeroProcesso: string;
    pasta: string;
  }[];
}