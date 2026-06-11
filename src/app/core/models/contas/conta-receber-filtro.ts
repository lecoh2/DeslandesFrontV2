export interface ContaReceberFiltro {
  search?: string;
  clienteId?: string;
  status?: number;
  formaRecebimento?: number;
  dataInicio?: Date;
  dataFim?: Date;
  valorMin?: number;
  valorMax?: number;
}