export interface WebJurPublicacao {
 id: string;

  codPublicacao: number;
  numeroProcesso: string;

  dataPublicacao: string;
  dataCadastroWebJur: string;
  dataDivulgacao?: string;

  despachoPublicacao?: string;
  processoPublicacao?: string;

  varaDescricao?: string;
  orgaoDescricao?: string;

  publicacaoCorrigida: boolean;
  importada: boolean;

  processoId?: string;

  // Novos campos
  anoPublicacao: number;
  edicaoDiario: number;
  descricaoDiario?: string;
  paginaInicial: number;
  paginaFinal: number;

  ufPublicacao?: string;
  cidadePublicacao?: string;

  codVinculo: number;
  nomeVinculo?: string;

  oabNumero: number;
  oabEstado?: string;

  codIntegracao?: string;
  publicacaoExportada: boolean;
  codGrupo: number;
}