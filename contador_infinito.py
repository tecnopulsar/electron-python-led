# contador_infinito.py
import time
import sys

print("Iniciando contador infinito...")
minutos = 0

while True:
    time.sleep(5)  # Esperar 60 segundos
    minutos += 1
    print(f"Se cumplio {minutos} minuto(s)!")
    sys.stdout.flush()  # Asegurar que la salida se envíe inmediatamente