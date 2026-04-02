import os
import requests
import json
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Carrega a chave do .env
load_dotenv()
API_KEY = os.getenv("SIOP_API_KEY")
SIOP_URL = "https://siop.planejamento.gov.br/modulo/impositivo/itens/api"

app = FastAPI(title="Portal das Emendas API")

# Configura CORS para o Next.js (portas 3000 ou 3001)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção deve ser específico
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos de Dados
class Emenda(BaseModel):
    id: str
    codigo: str
    autor: dict
    valor: dict
    beneficiarios: List[dict]
    localizador: Optional[dict] = None

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à API do Portal das Emendas"}

@app.get("/api/emendas")
def get_emendas(exercicio: int = 2026, municipio: str = "3534401"):
    """
    Busca emendas do SIOP para um exercício e município específicos.
    Default: Osasco (3534401), 2026.
    """
    if not API_KEY:
        raise HTTPException(status_code=500, detail="API_KEY não configurada no servidor.")

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    query = """
    query GetEmendas($exercicio: Int!, $municipio: String!) {
      emendas(filter: { 
        exercicio: $exercicio, 
        beneficiarios: { municipio: $municipio } 
      }) {
        id
        codigo
        autor { nome partido }
        valor { dotacao liquidado pago }
        localizador { descricao }
        beneficiarios {
          nomeBeneficiario
          municipio
        }
      }
    }
    """
    
    variables = {
        "exercicio": exercicio,
        "municipio": municipio
    }

    try:
        print(f"--- Buscando Emendas SIOP: Exercicio {exercicio}, Municipio {municipio} ---")
        response = requests.post(SIOP_URL, json={'query': query, 'variables': variables}, headers=headers, timeout=15)
        
        if response.status_code == 200:
            data = response.json()
            if "errors" in data:
                print(f"ERRO GraphQL: {data['errors']}")
                return {"success": False, "errors": data["errors"]}
            
            emendas = data.get("data", {}).get("emendas", [])
            print(f"Sucesso! Encontradas {len(emendas)} emendas reais.")
            
            # Se a API retornar vazio para um ano específico (o que acontece em exerícios sem emendas registradas)
            # Mostramos o mock para não deixar a tela vazia em demonstração.
            if len(emendas) == 0:
                print("Aviso: SIOP retornou lista vazia. Mostrando demonstração.")
                raise Exception("Empty list from SIOP")
                
            return {"success": True, "emendas": emendas}
        else:
            print(f"ERRO HTTP {response.status_code}: {response.text}")
            raise HTTPException(status_code=response.status_code, detail=f"Erro na API SIOP: {response.text}")

    except Exception as e:
        print(f"INFO: Usando modo de demonstração (Mock) - Motivo: {str(e)}")
        # Mock Variável conforme o período para ficar mais realista
        if exercicio >= 2024:
            autores = [
                {"nome": "KIM KATAGUIRI", "partido": "UB", "val": 433000},
                {"nome": "ADRIANA VENTURA", "partido": "NOVO", "val": 250000},
                {"nome": "RENATA ABREU", "partido": "PODE", "val": 500000}
            ]
        elif exercicio >= 2020:
            autores = [
                {"nome": "TIRIRICA", "partido": "PL", "val": 150000},
                {"nome": "MÁRCIO ALVINO", "partido": "PL", "val": 280000},
                {"nome": "TABATA AMARAL", "partido": "PSB", "val": 420000}
            ]
        else:
            autores = [
                {"nome": "HISTÓRICO - JOÃO DORIA", "partido": "PSDB", "val": 1200000},
                {"nome": "ANTIGO - VALTER CORREIA", "partido": "PT", "val": 350000}
            ]

        return {
            "success": True,
            "is_mock": True,
            "exercicio": exercicio,
            "emendas": [
                {
                    "id": f"{exercicio}-{idx}",
                    "codigo": f"{exercicio}{10000000 + idx}",
                    "autor": {"nome": a["nome"], "partido": a["partido"]},
                    "valor": {
                        "dotacao": a["val"], 
                        "liquidado": a["val"] if exercicio < 2026 else a["val"] * 0.8, 
                        "pago": a["val"] if exercicio < 2025 else a["val"] * 0.4
                    },
                    "localizador": {"descricao": f"Ação Governamental ({exercicio})"},
                    "beneficiarios": [{"nomeBeneficiario": "Prefeitura de Osasco"}]
                } for idx, a in enumerate(autores)
            ]
        }

@app.get("/api/stats")
def get_stats(exercicio: int = 2026):
    """Retorna os dados sumarizados para os cards do dashboard."""
    # Simulação de variação de stats por ano
    total = 14.8 if exercicio >= 2026 else (10.2 if exercicio >= 2022 else 8.5)
    util = 75 if exercicio >= 2026 else 100
    
    return {
        "exercicio": exercicio,
        "total_previsto": total,
        "utilizado": util,
        "status": "Finalizado" if exercicio < 2026 else "Regular",
        "setores": [
            {"nome": "Saúde", "percent": 42 if exercicio >= 2024 else 35, "valor": f"R$ {total*0.4:.1f}B"},
            {"nome": "Educação", "percent": 28, "valor": f"R$ {total*0.28:.1f}B"},
            {"nome": "Segurança", "percent": 15, "valor": f"R$ {total*0.15:.1f}B"},
            {"nome": "Outros", "percent": 15, "valor": f"R$ {total*0.15:.1f}B"}
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

@app.get("/api/emendas/info/{emenda_id}")
def get_emenda_detail(emenda_id: str):
    """Retorna detalhes profundos de uma emenda específica."""
    # Para demonstração, extraímos o ano do ID (nosso mock usa ID '2026-1')
    try:
        exercicio = int(emenda_id.split("-")[0])
    except:
        exercicio = 2026

    return {
        "success": True,
        "id": emenda_id,
        "codigo": f"{exercicio}4429",
        "ano": exercicio,
        "setor": "Saúde Pública",
        "titulo": "Reforma da UBS Central - Osasco",
        "descricao": "Modernização completa das instalações elétricas, hidráulicas e aquisição de novos equipamentos de triagem para a Unidade Básica de Saúde do Distrito Central.",
        "autor": {"nome": "Roberto Chaves", "partido": "PSDB"},
        "localizacao": "Osasco - Centro",
        "status": "Execução em Dia",
        "financeiro": {
            "empenhado": 1250000.00,
            "liquidado": 845200.50,
            "pago": 712000.00,
            "percentual_liquidado": 67,
            "percentual_pago": 57
        },
        "despesas": [
            {"data": "12/10/2023", "desc": "Compra de Equipamentos", "sub_desc": "Esfigmomanômetros e Macas", "fornecedor": "Med-Tech Soluções LTDA", "cnpj": "12.345.678/0001-90", "status": "PAGO", "valor": 45200.00},
            {"data": "05/10/2023", "desc": "Pagamento de Mão de Obra", "sub_desc": "Instalações Elétricas Especializadas", "fornecedor": "Construtora Alvorada S.A.", "cnpj": "98.765.432/0001-11", "status": "LIQUIDADO", "valor": 120000.00},
            {"data": "28/09/2023", "desc": "Insumos de Pintura", "sub_desc": "Tintas Antimicrobianas Hospitalares", "fornecedor": "Cores & Vida Ltda", "cnpj": "45.678.910/0001-22", "status": "PENDENTE", "valor": 12850.00}
        ]
    }
