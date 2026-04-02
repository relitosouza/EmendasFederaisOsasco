# Portal das Emendas - Osasco 2023

Sistema de monitoramento e gestão de emendas parlamentares federais e estaduais, com foco no município de Osasco/SP.

## 🚀 Tecnologias
- **Backend:** Python 3.10+, FastAPI, Requests (Integração SIOP GraphQL)
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Recharts, Lucide Icons

## 🛠️ Configuração

### 1. Backend
1. Entre na pasta `backend`:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
3. Crie um arquivo `.env` com sua chave do SIOP:
   ```env
   SIOP_API_KEY=sua_chave_aqui
   ```
4. Inicie o servidor:
   ```bash
   python main.py
   ```
   *O backend rodará em: http://localhost:8000*

### 2. Frontend
1. Entre na pasta `frontend`:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o dashboard:
   ```bash
   npm run dev
   ```
   *O frontend rodará em: http://localhost:3000*

## 📊 Funcionalidades
- **Dashboard Executivo:** Visão consolidada do orçamento e utilização.
- **Gráficos Dinâmicos:** Distribuição por setores (Saúde, Educação, etc.).
- **Lista de Emendas:** Monitoramento por autor e valor (Dados de Osasco 2023).
- **Atividades Recentes:** Histórico de status e liquidação.

---
Desenvolvido para análise estratégica de dados orçamentários.
