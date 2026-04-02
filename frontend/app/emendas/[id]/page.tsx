"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import ArrowLeft from "@mui/icons-material/ArrowLeft";
import Download from "@mui/icons-material/Download";
import FileText from "@mui/icons-material/Description";
import Search from "@mui/icons-material/Search";
import Bell from "@mui/icons-material/Notifications";
import Settings from "@mui/icons-material/Settings";
import AccountBalance from "@mui/icons-material/AccountBalance";
import Dashboard from "@mui/icons-material/Dashboard";
import Podcasts from "@mui/icons-material/Podcasts";
import HowToVote from "@mui/icons-material/HowToVote";
import Groups from "@mui/icons-material/Groups";
import Inventory2 from "@mui/icons-material/Inventory2";
import Add from "@mui/icons-material/Add";
import Help from "@mui/icons-material/Help";
import Logout from "@mui/icons-material/Logout";
import HealthAndSafety from "@mui/icons-material/HealthAndSafety";
import AccountBalanceWallet from "@mui/icons-material/AccountBalanceWallet";
import Payments from "@mui/icons-material/Payments";
import AttachFile from "@mui/icons-material/AttachFile";

interface DetalheEmenda {
  id: string;
  codigo: string;
  ano: number;
  setor: string;
  titulo: string;
  descricao: string;
  autor: { nome: string; partido: string };
  localizacao: string;
  status: string;
  financeiro: {
    empenhado: number;
    liquidado: number;
    pago: number;
    percentual_liquidado: number;
    percentual_pago: number;
  };
  despesas: Array<{
    data: string;
    desc: string;
    sub_desc: string;
    fornecedor: string;
    cnpj: string;
    status: string;
    valor: number;
  }>;
}

export default function EmendaDetail(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [data, setData] = useState<DetalheEmenda|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`http://localhost:8000/api/emendas/info/${params.id}`);
        const result = await res.json();
        if (result.success) setData(result);
      } catch (err) {
        console.error("Erro ao buscar detalhes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [params.id]);

  if (loading) return <div className="min-h-screen bg-slate-400 flex items-center justify-center text-white font-bold">Carregando detalhes...</div>;
  if (!data) return <div className="min-h-screen bg-slate-400 flex items-center justify-center text-white font-bold">Emenda não encontrada.</div>;

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  return (
    <div className="min-h-screen bg-[#94A3B8] text-[#191c1d] font-sans antialiased">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl flex justify-between items-center px-8 h-16 shadow-sm">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tighter text-[#003f87]">Transparência Parlamentar</Link>
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="/" className="text-slate-500 hover:text-slate-900 transition-colors">Painel</Link>
            <span className="text-[#003f87] border-b-2 border-[#003f87] font-semibold cursor-default">Emendas</span>
            <a className="text-slate-500 hover:text-slate-900 transition-colors" href="#">Legislação</a>
            <a className="text-slate-500 hover:text-slate-900 transition-colors" href="#">Relatórios</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 w-64 outline-none" placeholder="Buscar emendas..." type="text"/>
          </div>
          <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <Bell className="text-slate-600" />
          </button>
          <div className="h-8 w-8 rounded-full overflow-hidden border border-slate-200">
             <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXThBWjTO0LtSzzpkoMuTRa8nW3Wbce5AD66lfKH7WCp1ji2YCyIk-SMs75-37SAxfBlWxU-JEL6swF8pJFYyz_TCYSe6RyJ_885rbm3I227mXCHSED9N03FNjAGHf7QRcz0KtWyqJlr9sAoDiN9PCvf2BNDEGfXbV1FysSNeN3q2N9CIWFGPu-CQX0ekoCY7u1_m5HJVmArjb1dHb_WPxzAmhqYrTr9quNcWwDfWOuqqjlHQjDNEDIRslnRcPuZ3JS_HDiRqjrs0" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside className="h-screen w-64 fixed left-0 top-0 pt-20 bg-slate-50 flex flex-col gap-y-2 py-4 shadow-xl z-40">
        <div className="px-6 py-4 flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#003f87] flex items-center justify-center rounded-xl shadow-lg">
            <AccountBalance className="text-white" />
          </div>
          <div>
            <p className="font-bold text-slate-900 leading-none">Portal Executivo</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">Poder Legislativo</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <Link href="/" className="text-slate-600 hover:bg-white mx-2 rounded-lg flex items-center gap-3 px-4 py-3 transition-transform hover:translate-x-1 text-sm font-medium">
            <Dashboard fontSize="small"/> Visão Geral
          </Link>
          <a className="bg-blue-50 text-[#003f87] rounded-lg mx-2 flex items-center gap-3 px-4 py-3 transition-transform hover:translate-x-1 text-sm font-medium" href="#">
            <HowToVote fontSize="small" /> Registro de Votos
          </a>
          <a className="text-slate-600 hover:bg-white mx-2 rounded-lg flex items-center gap-3 px-4 py-3 transition-transform hover:translate-x-1 text-sm font-medium" href="#">
            <Groups fontSize="small" /> Diretório de Membros
          </a>
          <a className="text-slate-600 hover:bg-white mx-2 rounded-lg flex items-center gap-3 px-4 py-3 transition-transform hover:translate-x-1 text-sm font-medium" href="#">
            <Inventory2 fontSize="small" /> Arquivo
          </a>
        </nav>
        <div className="px-4 mt-auto mb-8">
          <button className="w-full bg-[#003f87] hover:bg-[#0056b3] text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all shadow-md active:scale-95">
            <Add /> Nova Emenda
          </button>
        </div>
        <div className="border-t border-slate-100 pt-4 pb-4">
          <a className="text-slate-600 hover:bg-white mx-2 rounded-lg flex items-center gap-3 px-4 py-2 text-sm font-medium" href="#">
            <Help fontSize="small" /> Suporte
          </a>
          <a className="text-red-600 hover:bg-red-50 mx-2 rounded-lg flex items-center gap-3 px-4 py-2 text-sm font-medium" href="#">
            <Logout fontSize="small" /> Sair
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 pt-24 pb-12 px-8 min-h-screen">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Back Button */}
          <Link href="/" className="flex items-center gap-2 text-white font-bold hover:translate-x-[-4px] transition-transform w-fit">
            <ArrowLeft /> Voltar ao Painel
          </Link>

          {/* 1. Header Card: Summary */}
          <section className="bg-white rounded-2xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-full opacity-5 pointer-events-none">
              <HealthAndSafety style={{ fontSize: 160 }} className="translate-x-1/4 translate-y-1/4" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-blue-50 text-[#003f87] text-[10px] font-bold tracking-widest uppercase rounded-full">
                  {data.setor}
                </span>
                <span className="text-slate-400 text-sm">•</span>
                <span className="text-slate-500 text-sm font-medium">Exercício {data.ano}</span>
              </div>
              <h1 className="text-3xl font-black text-[#191c1d] tracking-tight mb-2">
                {data.titulo} - Emenda #{data.codigo}
              </h1>
              <p className="text-slate-600 max-w-2xl text-lg font-light leading-relaxed">
                {data.descricao}
              </p>
              <div className="mt-6 flex flex-wrap gap-8 text-sm">
                <div>
                  <span className="text-slate-400 block mb-1 uppercase text-[10px] font-bold">Autor</span>
                  <span className="font-bold text-slate-700">{data.autor.nome} ({data.autor.partido})</span>
                </div>
                <div className="w-px bg-slate-200 h-10 hidden sm:block"></div>
                <div>
                  <span className="text-slate-400 block mb-1 uppercase text-[10px] font-bold">Localização</span>
                  <span className="font-bold text-slate-700">{data.localizacao}</span>
                </div>
                <div className="w-px bg-slate-200 h-10 hidden sm:block"></div>
                <div>
                  <span className="text-slate-400 block mb-1 uppercase text-[10px] font-bold">Status Global</span>
                  <span className="flex items-center gap-1.5 text-emerald-600 font-black">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 
                    {data.status}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Financial Summary Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FinancialCard 
              label="Total Empenhado" 
              value={formatCurrency(data.financeiro.empenhado)} 
              icon={<AccountBalanceWallet className="text-blue-600" />} 
              sub="100% do orçamento reservado"
              color="blue"
            />
            <FinancialCard 
              label="Total Liquidado" 
              value={formatCurrency(data.financeiro.liquidado)} 
              icon={<FileText className="text-amber-600" />} 
              percent={data.financeiro.percentual_liquidado}
              color="amber"
            />
            <FinancialCard 
              label="Total Pago" 
              value={formatCurrency(data.financeiro.pago)} 
              icon={<Payments className="text-emerald-600" />} 
              sub={`${data.financeiro.percentual_pago}% efetivamente desembolsado`}
              color="emerald"
            />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* 3. Main Expense Table Card (Large) */}
            <section className="lg:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
                <h2 className="text-lg font-bold text-slate-900">Detalhamento de Despesas</h2>
                <button className="text-sm font-semibold text-[#003f87] flex items-center gap-1 hover:underline">
                  <Download fontSize="small" /> Exportar CSV
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Descrição</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fornecedor</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Valor (R$)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data.despesas.map((d, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">{d.data}</td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-800">{d.desc}</p>
                          <p className="text-xs text-slate-400">{d.sub_desc}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-medium text-slate-700">{d.fornecedor}</p>
                          <p className="text-[10px] text-slate-400">{d.cnpj}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase ${
                            d.status === 'PAGO' ? 'bg-emerald-50 text-emerald-700' : 
                            d.status === 'LIQUIDADO' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">
                          {d.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
                <button className="text-xs font-bold text-slate-500 hover:text-[#003f87] transition-colors uppercase tracking-widest">Ver Mais Registros</button>
              </div>
            </section>

            {/* 4. Charts Card */}
            <section className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-1">Evolução Mensal</h2>
                <p className="text-xs text-slate-400">Desembolsos acumulados (milhares R$)</p>
              </div>
              {/* Visual Mock Chart */}
              <div className="h-48 w-full flex items-end gap-3 px-2 pb-2">
                {[20, 60, 45, 80, 100, 75].map((h, i) => (
                  <div key={i} className="flex-1 bg-slate-100 rounded-t-lg relative group transition-all" style={{ height: `${h}%` }}>
                    <div className="absolute bottom-0 w-full bg-[#003f87]/20 rounded-t-lg h-[60%] group-hover:bg-[#003f87]/40"></div>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-slate-50">
                <h3 className="text-sm font-bold text-slate-900 mb-4">Divisão por Categoria</h3>
                <div className="space-y-4">
                   <CategoryProgress label="Equipamentos" percent={42} color="bg-blue-600" />
                   <CategoryProgress label="Mão de Obra" percent={35} color="bg-amber-500" />
                   <CategoryProgress label="Insumos" percent={23} color="bg-slate-400" />
                </div>
              </div>
            </section>
          </div>

          {/* Contextual Document Card */}
          <section className="bg-white rounded-2xl p-6 shadow-xl flex items-center justify-between border border-blue-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center">
                <AttachFile className="text-slate-400" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">Documentação Completa</h4>
                <p className="text-sm text-slate-500">Acesse editais, contratos e notas fiscais vinculadas.</p>
              </div>
            </div>
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-2 rounded-xl text-sm font-bold transition-all shadow-sm">
                Abrir Pasta Digital
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

function FinancialCard({ label, value, icon, sub, percent, color }: any) {
  const colorMap: any = {
    blue: "text-blue-700",
    amber: "text-amber-600",
    emerald: "text-emerald-700",
  };
  const iconBg: any = {
    blue: "bg-blue-50",
    amber: "bg-amber-50",
    emerald: "bg-emerald-50",
  };
  const barBg: any = {
    amber: "bg-amber-500",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col justify-between min-h-[140px] hover:scale-[1.02] transition-transform">
      <div className="flex justify-between items-start">
        <span className="text-slate-500 font-medium text-sm">{label}</span>
        <div className={`p-2 rounded-xl ${iconBg[color]}`}>
          {icon}
        </div>
      </div>
      <div>
        <span className={`text-3xl font-black tracking-tight ${colorMap[color]}`}>{value}</span>
        {sub && <p className="text-[10px] text-slate-400 uppercase mt-2 font-bold">{sub}</p>}
        {percent !== undefined && (
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className={`${barBg[color]} h-full`} style={{ width: `${percent}%` }}></div>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryProgress({ label, percent, color }: { label: string, percent: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-slate-600 font-medium">{label}</span>
        <span className="text-slate-900 font-bold">{percent}%</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}
