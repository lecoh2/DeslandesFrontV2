export interface ContratoResponse {
  id: string;
  numero: string;
  pessoaId: string;
  nomePessoa: string;
  valorContrato: number;
  dataInicio: Date;
  dataFim?: Date;

}