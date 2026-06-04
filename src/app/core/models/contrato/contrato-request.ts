export interface ContratoRequest {
  numero: string;
  pessoaId: string;
  valorTotal: number;
  dataInicio: Date;
  dataFim?: Date;
    processosIds: string[];
    observacao?: string;

}