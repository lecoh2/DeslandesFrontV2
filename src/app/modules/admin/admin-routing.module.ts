import { RouterModule, Routes } from "@angular/router";
import { PainelPrincipal } from "./components/painel-principal/painel-principal";
import { NgModule } from "@angular/core";


//import { EditarTipoTriagemComponent } from "./components/tipo-triagem/editar-tipo-triagem/editar-tipo-triagem.component";
import { AuthGuard } from "../../core/guards/auth.guard";
import { NivelGuard } from "../../core/guards/nivel.guard";
import { AdminLayout } from "./layouts/layouts/admin-layout/admin-layout";
import { CadastrarPessoas } from "./components/pessoa/cadastrar-pessoa/cadastrar-pessoas";
import { ConsultarPessoas } from "./components/pessoa/consultar-pessoas/consultar-pessoas";
import { CadastrarProcesso } from "./components/processo/cadastrar-processo/cadastrar-processo";
import { CadastrarAtendimento } from "./components/atendimento/cadastrar-atendimento/cadastrar-atendimento";
import { CadastrarCaso } from "./components/caso/cadastrar-caso/cadastrar-caso";
import { GestaoAtividades } from "./components/gestao-atividades/gestao/gestao-atividades";
import { CadastrarTarefa } from "./components/tarefa/cadastrar-tarefa/cadastar-tarefa/cadastar-tarefa";
import { CadastrarEvento } from "./components/evento/cadastrar-evento/cadastrar-evento";
import { EditarTarefa } from "./components/tarefa/editar-tarefa/editar-tarefa";
import { EditarEvento } from "./components/evento/editar-evento/editar-evento";
import { ConsultarAtendimento } from "./components/atendimento/consultar-atendimento/consultar-atendimento";
import { EditarAtendimento } from "./components/atendimento/editar-atendimento/editar-atendimento";
import { ConsultarCaso } from "./components/caso/consultar-caso/consultar-caso";
import { ConsultarProcesso } from "./components/processo/consultar-processo/consultar-processo";
import { EditarCaso } from "./components/caso/editar-caso/editar-caso";
import { EditarProcesso } from "./components/processo/editar-processo/editar-processo";
import { ConsultarTarefa } from "./components/tarefa/consultar-tarefa/consultar-tarefa";
import { ConsultarEvento } from "./components/evento/consultar-evento/consultar-evento";

import { Agenda } from "./components/gestao-atividades/agenda/agenda";
import { CriarUsuario } from "./components/usuario/criar-usuario/criar-usuario";
import { Perfil } from "./components/usuario/perfil/perfil";
import { EditarUsuario } from "./components/usuario/editar-usuario/editar-usuario";
import { ConsultarUsuarios } from "./components/usuario/consultar-usuarios/consultar-usuarios";
import { ImportarProcessoExcel } from "./components/processo/importar/importar-processo-excel";
import { CadastrarContrato } from "./components/contrato/cadastrar/cadastrar-contrato";
import { ConsultarContrato } from "./components/contrato/consultar/consultar-contrato";
import { CadastrarCentroCusto } from "./components/centro-custo/cadatrar/cadastrar-centro-custo";
import { ConsultarCentroCusto } from "./components/centro-custo/consultar/consultar-centro-custo";
import { EditarCentroCusto } from "./components/centro-custo/editar/editar-centro-custo";
import { EditarContrato } from "./components/contrato/editar/editar-contrato";
import { CadastrarContaReceber } from "./components/conta-receber/cadastrar/cadastrar-conta-receber";
import { ConsultarContaReceber } from "./components/conta-receber/consultar/consultar-conta-receber";
import { VisualizarContaReceber } from "./components/conta-receber/visualizar/visualizar-conta-receber";
import { EditarContaReceber } from "./components/conta-receber/editar/editar-conta-receber";
import { CadastrarContaPagar } from "./components/conta-pagar/cadastrar/cadastrar-conta-pagar";
//import { CriarUsuario } from "./components/usuario/criar-usuario/criar-usuario";


export const routes: Routes = [
    {
        path: '',
        component: AdminLayout,
        children: [
            {
                path: 'painel-principal',
                component: PainelPrincipal,
                canActivate: [AuthGuard] // apenas logado
            },
            //pessoas
            {
                path: 'cadastrar-pessoas',
                component: CadastrarPessoas,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador', 'Administração', 'Coordenador', 'Conciliador', 'Estagiários'] }

            },
            {
                path: 'consultar-pessoas',
                component: ConsultarPessoas,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador', 'Administração', 'Coordenador', 'Conciliador', 'Estagiários'] }

            },
            //processo
            {
                path: 'cadastrar-processo',
                component: CadastrarProcesso,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador', 'Administração', 'Coordenador', 'Conciliador', 'Estagiários'] }

            }, {
                path: 'editar-processo/:id',
                component: EditarProcesso,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador', 'Administração', 'Coordenador', 'Conciliador', 'Estagiários'] }

            },
            {
                path: 'consultar-processo',
                component: ConsultarProcesso,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador', 'Administração', 'Coordenador', 'Conciliador', 'Estagiários'] }

            },
            {
                path: 'importar-processo-excel',
                component: ImportarProcessoExcel,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador', 'Administração', 'Coordenador', 'Conciliador', 'Estagiários'] }

            },
            //atendmento
            {
                path: 'cadastrar-atendimento',
                component: CadastrarAtendimento,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador', 'Administração', 'Coordenador', 'Conciliador', 'Estagiários'] }
            },
            {
                path: 'consultar-atendimento',
                component: ConsultarAtendimento,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador', 'Administração', 'Coordenador', 'Conciliador', 'Estagiários'] }

            }, {
                path: 'editar-atendimento/:id',
                component: EditarAtendimento,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador', 'Administração', 'Coordenador', 'Conciliador', 'Estagiários'] }

            },
            //ação
            {
                path: 'cadastrar-caso',
                component: CadastrarCaso,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador', 'Administração', 'Coordenador', 'Conciliador', 'Estagiários'] }

            }, {
                path: 'consultar-caso',
                component: ConsultarCaso,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador', 'Administração', 'Coordenador', 'Conciliador', 'Estagiários'] }

            },
            {
                path: 'editar-caso/:id',
                component: EditarCaso,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador', 'Administração', 'Coordenador', 'Conciliador', 'Estagiários'] }

            },
            //tarefa
            {
                path: 'cadastrar-tarefa',
                component: CadastrarTarefa,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador', 'Administração', 'Coordenador', 'Conciliador', 'Estagiários'] }

            },    //tarefa
            {
                path: 'editar-tarefa/:id',
                component: EditarTarefa,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador', 'Administração', 'Coordenador', 'Conciliador', 'Estagiários'] }

            },
            {
                path: 'consultar-tarefa',
                component: ConsultarTarefa,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador', 'Administração', 'Coordenador', 'Conciliador', 'Estagiários'] }

            },
            {
                path: 'cadastrar-evento',
                component: CadastrarEvento,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador', 'Administração', 'Coordenador', 'Conciliador', 'Estagiários'] }

            }, {
                path: 'editar-evento/:id',
                component: EditarEvento,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador', 'Administração', 'Coordenador', 'Conciliador', 'Estagiários'] }

            },
            {
                path: 'consultar-evento',
                component: ConsultarEvento,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador', 'Administração', 'Coordenador', 'Conciliador', 'Estagiários'] }

            },
            //atividades
            {
                path: 'gestao-atividades',
                component: GestaoAtividades,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador', 'Administração', 'Coordenador', 'Conciliador', 'Estagiários'] }

            },
            {
                path: 'agenda',
                component: Agenda,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador', 'Administração', 'Coordenador', 'Conciliador', 'Estagiários'] }

            },
            //usuario
            {
                path: 'criar-usuario',
                component: CriarUsuario,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador', 'Administração', 'Coordenador', 'Conciliador', 'Estagiários'] }

            },
            {
                path: 'consultar-usuarios',
                component: ConsultarUsuarios,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador'] } // quem pode acessar
            }, {
                path: 'editar-usuario/:id',
                component: EditarUsuario,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador'] } // quem pode acessar
            },

        
            {
                path: 'cadastrar-contrato',
                component: CadastrarContrato,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador'] } // quem pode acessar
            }, {
                path: 'consultar-contratos',
                component: ConsultarContrato,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador'] } // quem pode acessar
            }, {
                path: 'editar-contrato/:id',
                component: EditarContrato,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador'] } // quem pode acessar
            },
             {
                path: 'editar-centro-custo/:id',
                component: EditarCentroCusto,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador'] } // quem pode acessar
            },
            {
                path: 'cadastrar-conta-receber',
                component: CadastrarContaReceber,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador'] } // quem pode acessar
            }, {
                path: 'consultar-conta-receber',
                component: ConsultarContaReceber,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador'] } // quem pode acessar
            }
            ,
             {
                path: 'editar-conta-receber/:id',
                component: EditarContaReceber,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador'] } // quem pode acessar
             },
             {
                path: 'visualizar-conta-receber/:id',
                component: VisualizarContaReceber,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador'] } // quem pode acessar
             },
             //conta pagar
             
            {
                path: 'cadastrar-conta-pagar',
                component: CadastrarContaPagar,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador'] } // quem pode acessar
            },
            {
                path: 'perfil',
                component: Perfil,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador', 'Administração', 'Coordenador', 'Conciliador', 'Estagiários'] }
                // quem pode acessar
            },
//centro de custo
{
                path: 'cadastrar-centro-custo',
                component: CadastrarCentroCusto,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador'] } // quem pode acessar
            }, {
                path: 'consultar-centro-custo',
                component: ConsultarCentroCusto,
                canActivate: [AuthGuard, NivelGuard],
                data: { niveis: ['Super Administrador', 'Administrador'] } // quem pode acessar
            },
            { path: '', redirectTo: 'painel-principal', pathMatch: 'full' }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }