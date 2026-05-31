export interface ContratoRequest {
  numero: string;
  pessoaId: string;
  valorContrato: number;
  dataInicio: Date;
  dataFim?: Date;

}