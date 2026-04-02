import requests
import json

def test_api(url, name):
    print(f"Testing {name}: {url}")
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    }
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Content Type: {response.headers.get('Content-Type')}")
        if response.status_code == 200:
            try:
                data = response.json()
                print("Response is valid JSON.")
                # Print a snippet of the data
                print(json.dumps(data, indent=2)[:500])
            except:
                print("Response is NOT JSON. First 200 chars:")
                print(response.text[:200])
        else:
            print(f"Failed. Response text (first 200 chars): {response.text[:200]}")
    except Exception as e:
        print(f"Error: {e}")
    print("-" * 40)

# URL provided by user
url_user = "https://siop.planejamento.gov.br/modulo/itens/api/modulo/emendas/api"
# URL found by subagent (GraphQL)
url_gql = "https://www.siop.planejamento.gov.br/modulo/impositivo/itens/api"

test_api(url_user, "User Provided API")
test_api(url_gql, "SIOP GraphQL API")
