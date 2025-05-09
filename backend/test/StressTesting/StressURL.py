#Este script es de estres para las rutas accesibles a alguien que sea fuera de ser un empleado
import request
from concurrent.futures import ThreadPoolExecutor

def stress_test(url):
    try:
        response = request.get(url)
        print(f"Respuesta: {response.status_code} {url}")
    except request.exceptions.RequestException as e:
        print(f"error en la {url}: {e}")

url = 'URL_API'

num_threads = 100

with ThreadPoolExecutor(max_workers=num_threads) as executor:
    for _ in range(num_threads):
        executor.submit(stress_test, url)