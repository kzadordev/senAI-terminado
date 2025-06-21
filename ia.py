import google.generativeai as genai
import os
from dotenv import load_dotenv
from flask import Flask, request, render_template_string
import markdown

load_dotenv()

CLAVE_API = os.getenv("CLAVE_GEMINI_API")

if not CLAVE_API:
    raise ValueError("La clave de la API de Gemini no está configurada en el archivo .env")

genai.configure(api_key=CLAVE_API)

try:
    with open("data/reglamento_sena.txt", "r", encoding='utf-8') as f:
        reglamento_sena = f.read()
except FileNotFoundError:
    raise FileNotFoundError("El archivo 'reglamento_sena.txt' no se encuentra en 'data/'. Asegúrate de que la ruta sea correcta.")
except Exception as e:
    raise Exception(f"Error al leer el archivo reglamento_sena.txt: {e}")

modelo = genai.GenerativeModel(model_name="models/gemini-1.5-flash")

app = Flask(__name__)

def obtener_respuesta(pregunta):
    pregunta_lower = pregunta.lower().strip()

    if pregunta_lower in ["hola", "saludos", "buenos días", "buenas tardes", "buenas noches"]:
        return "¡Hola! ¿En qué puedo ayudarte hoy con el reglamento del SENA?"
    elif pregunta_lower in ["adiós", "chao", "hasta luego", "nos vemos"]:
        return "¡Hasta pronto! Que tengas un buen día."
    elif pregunta_lower in ["gracias", "muchas gracias", "te lo agradezco"]:
        return "De nada, estoy aquí para ayudarte."

    palabras_sin_contexto = ["qué", "quién", "cuándo", "dónde", "por", "favor", "ayuda", "reglamento", "sena"]
    if any(word in pregunta_lower.split() for word in palabras_sin_contexto) and len(pregunta_lower.split()) <= 2:
        return "Necesito un poco más de contexto para poder ayudarte. ¿Podrías reformular tu pregunta sobre el reglamento del SENA?"

    prompt = f"""
Eres un experto en el reglamento del SENA. Responde esta pregunta basándote solo en los artículos 41 al 63.
**IMPORTANTE**: Resalta los términos o frases clave utilizando **negrilla** (doble asterisco al inicio y al final de la palabra o frase, por ejemplo: **texto en negrilla**).
Asegúrate de usar saltos de línea para que el texto sea legible.

Pregunta: {pregunta}

Reglamento del SENA:
{reglamento_sena}
"""
    try:
        response = modelo.generate_content(prompt)
        respuesta_bruta = response.text.strip() if hasattr(response, 'text') else "No se pudo generar una respuesta de texto."
        respuesta_html = markdown.markdown(respuesta_bruta)

        return respuesta_html
    except Exception as e:
        print("Error de Gemini en obtener_respuesta:", e)
        return f"Error al generar la respuesta: {e}"

@app.route('/', methods=['GET', 'POST'])
def index():
    respuesta_mostrada = ""
    pregunta_usuario = ""
    if request.method == 'POST':
        pregunta_usuario = request.form['pregunta']
        respuesta_mostrada = obtener_respuesta(pregunta_usuario)
    
    html_template = """
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Asistente de Reglamento SENA</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background-color: #f4f4f4; color: #333; }
            .container { max-width: 800px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            h1 { color: #0056b3; }
            form { display: flex; margin-bottom: 20px; }
            input[type="text"] { flex-grow: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-right: 10px; }
            input[type="submit"] { padding: 10px 15px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
            input[type="submit"]:hover { background-color: #0056b3; }
            .respuesta { background-color: #e9ecef; padding: 15px; border-radius: 4px; border: 1px solid #dee2e6; white-space: pre-wrap; word-wrap: break-word; }
            .respuesta p { margin-bottom: 5px; } /* Pequeño ajuste para párrafos si la librería Markdown los crea */
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Asistente de Reglamento SENA</h1>
            <form method="POST">
                <input type="text" name="pregunta" placeholder="Haz tu pregunta sobre el reglamento..." value="{{ pregunta_usuario }}">
                <input type="submit" value="Preguntar">
            </form>
            {% if respuesta_mostrada %}
                <h2>Respuesta:</h2>
                <div class="respuesta">{{ respuesta_mostrada | safe }}</div>
            {% endif %}
        </div>
    </body>
    </html>
    """
    return render_template_string(html_template, respuesta_mostrada=respuesta_mostrada, pregunta_usuario=pregunta_usuario)

if __name__ == '__main__':
    app.run(debug=True) # Ejecuta la aplicación Flask en modo depuración