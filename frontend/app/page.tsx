"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  BarChart3, 
  Wallet, 
  CreditCard, 
  Users, 
  HelpCircle, 
  LogOut, 
  Bell, 
  Settings, 
  LayoutDashboard,
  Filter,
  ArrowRight,
  TrendingUp,
  FileText,
  History,
  HardHat,
  AlertTriangle,
  Menu,
  Plus
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip 
} from "recharts";

interface Emenda {
  id: string;
  codigo: string;
  autor: { nome: string; partido: string };
  valor: { dotacao: number; liquidado: number; pago: number };
  localizador: { descricao: string };
  beneficiarios: { nomeBeneficiario: string }[];
}

interface Stats {
  total_previsto: number;
  utilizado: number;
  status: string;
  setores: { nome: string; percent: number; valor: string }[];
}

export default function Home() {
  const [emendas, setEmendas] = useState<Emenda[]>([]);
  const [stats, setStats] = useState<Stats|null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(2026);

  const years = Array.from({ length: 2026 - 2014 + 1 }, (_, i) => 2026 - i);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [emendasRes, statsRes] = await Promise.all([
          fetch(`http://localhost:8000/api/emendas?exercicio=${selectedYear}`),
          fetch(`http://localhost:8000/api/stats?exercicio=${selectedYear}`)
        ]);
        
        const emendasData = await emendasRes.json();
        const statsData = await statsRes.json();
        
        if (emendasData.success) setEmendas(emendasData.emendas);
        setStats(statsData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedYear]);

  const COLORS = ["#003f87", "#60a5fa", "#9ca3af", "#e5e7eb"];

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  return (
    <div className="min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16 w-[96%] mx-auto mt-4 rounded-3xl bg-white/80 backdrop-blur-xl shadow-lg text-zinc-800">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-1.5 rounded-lg">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-black tracking-tighter text-zinc-900">Portal de Emendas</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
          <a className="text-primary border-b-2 border-primary pb-1" href="#">Início</a>
          <a className="text-zinc-500 hover:text-zinc-800 transition-colors" href="#">Emendas</a>
          <a className="text-zinc-500 hover:text-zinc-800 transition-colors" href="#">Relatórios</a>
          <a className="text-zinc-500 hover:text-zinc-800 transition-colors" href="#">Transparência</a>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-zinc-100 p-1 rounded-2xl border border-zinc-200">
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="bg-transparent text-sm font-black text-zinc-900 px-3 py-1 outline-none cursor-pointer"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <button className="p-2 hover:bg-zinc-100 rounded-lg transition-all">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-200 border border-zinc-200 cursor-pointer">
            <img 
              alt="Foto de perfil" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwY6AfVbU1RuEfpo8jceHUmz3LFxeC1WsYN6p7z3A9yJHB5DyM4F5vk3XZDkkuqYoQnbOdPzrJ0GVpx4mLF7mjLlHX4FaFFOscosGJCEOmaIe-hrkhT5mr-Fe5p7sZPqTU-8KwmuYIKh-eY7Tf2Cc1tk3EVX47HpyMI88NCI7qfG3tR_osVVcg_NfnZppH6wpwVxxeSsOL7hs5KXmiPCVrOGgug-nZ2GrRYkv_rWqJvwzYu46rSbNJ2NYxnitdSJEIgU8S2NZcXzA" 
            />
          </div>
        </div>
      </nav>

      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 p-4 gap-4 w-64 pt-28 text-sm font-medium">
        <div className="flex flex-col gap-1.5">
          <NavItem active icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem icon={<Wallet size={20} />} label="Minhas Emendas" />
          <NavItem icon={<CreditCard size={20} />} label="Orçamento" />
          <NavItem icon={<Users size={20} />} label="Parlamentares" />
          <NavItem icon={<HelpCircle size={20} />} label="Suporte" />
        </div>
        <div className="mt-auto border-t border-zinc-200 pt-4">
          <NavItem icon={<LogOut size={20} />} label="Sair" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-28 px-4 md:px-8 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Section */}
          <section className="grid grid-cols-1">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-container to-primary p-8 md:p-12 shadow-2xl text-white">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <LayoutDashboard className="w-48 h-48 md:w-64 md:h-64" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4">
                  <span className="text-on-primary-container font-bold tracking-widest uppercase text-xs">Consolidação Fiscal - Osasco/SP {selectedYear}</span>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                    Emendas Federais <br />e Estaduais {selectedYear}
                  </h1>
                  <p className="text-lg text-on-primary-container/80 max-w-lg font-light leading-relaxed">
                    Gestão estratégica e monitoramento em tempo real das dotações orçamentárias de {selectedYear} para o município de Osasco.
                  </p>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
                      <span className="block text-xs uppercase opacity-70 mb-1">Total Previsto</span>
                      <span className="text-2xl font-bold">R$ {stats?.total_previsto || 14.8} Bi</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
                      <span className="block text-xs uppercase opacity-70 mb-1">Status Global</span>
                      <span className="flex items-center gap-2 text-2xl font-bold">
                        <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
                        {stats?.status || "Regular"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Visual */}
                <div className="relative flex items-center justify-center">
                  <svg className="w-40 h-40 md:w-56 md:h-56 transform -rotate-90">
                    <circle cx="50%" cy="50%" fill="transparent" r="45%" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                    <circle 
                      className="text-white drop-shadow-lg" 
                      cx="50%" cy="50%" fill="transparent" r="45%" 
                      stroke="currentColor" strokeDasharray="283" 
                      strokeDashoffset={283 - (283 * (stats?.utilizado || 75)) / 100} 
                      strokeWidth="12" 
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl md:text-5xl font-black">{stats?.utilizado || 75}%</span>
                    <span className="text-xs uppercase font-bold tracking-widest opacity-80">Utilizado</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Emendas List */}
            <div className="lg:col-span-12 space-y-6">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Execução Detalhada por Emenda</h2>
                <button className="flex items-center gap-2 text-primary font-bold hover:bg-primary/5 px-4 py-2 rounded-xl transition-all">
                  <Filter className="w-4 h-4" />
                  Filtrar
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full text-center py-20 text-zinc-400 font-medium">Carregando dados do SIOP...</div>
                ) : emendas.map((e, index) => (
                  <Link 
                    key={e.id || index} 
                    href={`/emendas/${e.id || `${selectedYear}-${index}`}`}
                    className="bg-white rounded-3xl p-6 shadow-xl border border-zinc-100 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group cursor-pointer block"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-zinc-50 rounded-2xl group-hover:bg-primary/5 transition-colors">
                        <Users className="text-primary w-6 h-6" />
                      </div>
                      <span className="text-[10px] bg-zinc-100 text-zinc-500 px-3 py-1 rounded-full font-black uppercase">
                        {e.codigo}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-black text-zinc-900 leading-tight">{e.autor.nome}</h3>
                        <p className="text-xs text-zinc-400 font-medium">{e.autor.partido} • {e.localizador.descricao}</p>
                      </div>

                      <div className="bg-zinc-50 rounded-2xl p-4 space-y-3">
                        <div className="flex justify-between text-xs">
                          <span className="text-zinc-500 font-medium">Beneficiário:</span>
                          <span className="text-zinc-900 font-bold text-right truncate max-w-[150px]">
                            {e.beneficiarios[0]?.nomeBeneficiario}
                          </span>
                        </div>
                        <div className="h-px bg-zinc-200/50 w-full" />
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-zinc-500 font-medium text-blue-800">Valor Bruto:</span>
                          <span className="text-sm font-black text-zinc-900">{formatCurrency(e.valor.dotacao)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-zinc-500 font-medium text-emerald-800">Liquidado:</span>
                          <span className="text-sm font-black text-emerald-600">{formatCurrency(e.valor.liquidado || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-zinc-500 font-medium text-primary-fixed-variant">Valor Pago:</span>
                          <span className="text-sm font-black text-primary">{formatCurrency(e.valor.pago || 0)}</span>
                        </div>
                      </div>

                      {/* Mini visual progress for payment */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                          <span className="text-zinc-400">Progresso de Pagamento</span>
                          <span className="text-primary">
                            {e.valor.dotacao > 0 ? Math.round((e.valor.pago / e.valor.dotacao) * 100) : 0}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-500" 
                            style={{ width: `${e.valor.dotacao > 0 ? (e.valor.pago / e.valor.dotacao) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Charts & Activity */}
            <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
              {/* Pie Chart Section */}
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-zinc-100 flex flex-col md:flex-row gap-8 items-center overflow-hidden">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-zinc-900 tracking-tight mb-2">Investimento por Setor</h2>
                  <p className="text-sm text-zinc-500 mb-6 leading-relaxed">Distribuição percentual dos recursos alocados para o município no exercício.</p>
                  <ul className="space-y-3">
                    {stats?.setores.map((s, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></span>
                        <span className="text-sm font-medium text-zinc-700">{s.nome} ({s.percent}%)</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="w-full h-48 md:w-48 flex justify-center items-center relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats?.setores || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="percent"
                        stroke="none"
                      >
                        {(stats?.setores || []).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 m-auto w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-inner pt-0.5">
                    <TrendingUp className="text-primary w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Recent Activity Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Atividades Recentes</h2>
                  <button className="text-sm font-bold text-primary hover:underline transition-all">Ver histórico</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ActivityCard 
                    icon={<FileText className="text-blue-700" />} 
                    title="Emenda RP9 - Saúde" 
                    time="Cadastrada há 2 horas" 
                    value="R$ 1.2M" 
                    status="Aprovada" 
                    statusColor="emerald"
                  />
                  <ActivityCard 
                    icon={<History className="text-amber-700" />} 
                    title="Ajuste Orçamentário" 
                    time="Processado há 5 horas" 
                    value="--" 
                    status="Em revisão" 
                    statusColor="amber"
                  />
                  <ActivityCard 
                    icon={<HardHat className="text-blue-700" />} 
                    title="Obras Osasco Sul" 
                    time="Liberação concluída" 
                    value="R$ 8.5M" 
                    status="Liquidado" 
                    statusColor="blue"
                  />
                  <ActivityCard 
                    icon={<AlertTriangle className="text-red-700" />} 
                    title="Pendente de Doc" 
                    time="Em análise técnica" 
                    value="--" 
                    status="Atenção" 
                    statusColor="red"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group">
        <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <a className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? "bg-white shadow-md text-primary font-bold" 
        : "text-zinc-500 hover:bg-zinc-200/50 hover:translate-x-1"
    }`} href="#">
      {icon}
      <span>{label}</span>
    </a>
  );
}

function ActivityCard({ icon, title, time, value, status, statusColor }: any) {
  const colorMap: any = {
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    red: "bg-red-50 text-red-700",
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-md transition-all group cursor-pointer">
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-xl bg-zinc-50 group-hover:bg-white transition-colors`}>
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-zinc-900">{title}</p>
          <p className="text-xs text-zinc-500">{time}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wider ${colorMap[statusColor]}`}>
              {status}
            </span>
            <span className="text-sm font-black text-zinc-900">{value}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
