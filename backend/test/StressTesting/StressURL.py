#Este script es de estres para las rutas accesibles a alguien que sea fuera de ser un empleado
import requests
from concurrent.futures import ThreadPoolExecutor

def stress_test(url):
    try:
        response = request.get(url)
        print(f"Respuesta: {response.status_code} {url}")
    except request.exceptions.RequestException as e:
        print(f"error en la {url}: {e}")

url = 'http://baseball-defines-international-thru.trycloudflare.com/edufast/'

num_threads = 600

with ThreadPoolExecutor(max_workers=num_threads) as executor:
    for _ in range(num_threads):
        executor.submit(stress_test, url)
