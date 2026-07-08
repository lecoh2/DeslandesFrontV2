export interface ProcessoPublicacaoWebJurResponse {

  id: string;

  codPublicacao: number;

  numeroProcesso: string;

  dataPublicacao: Date;

  dataDivulgacao?: Date;

  varaDescricao?: string;

  orgaoDescricao?: string;

  textoPublicacao?: string;

  descricaoDiario?: string;

  anoPublicacao: number;

  edicaoDiario: number;

  paginaInicial: number;

  paginaFinal: number;

  nomeVinculo?: string;

  oabNumero: number;

  oabEstado?: string;

}