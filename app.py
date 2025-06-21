from flask import Flask, request, jsonify, render_template
from ia import obtener_respuesta
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)

@app.route('/')
def pagina_principal():
    return render_template('index.html')

@app.route('/chatbot')
def chatbot():
    return render_template('ia.html')

@app.route('/pregunta', methods=['POST'])
def pregunta():
    pregunta = request.json.get('pregunta')
    print("Pregunta recibida:", pregunta)
    respuesta = obtener_respuesta(pregunta) 
    print("Respuesta generada:", respuesta)
    return jsonify({'respuesta': respuesta})

@app.route('/descargar')
def descargar():
    return render_template('descargar.html')

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))     
    app.run(host='0.0.0.0', port=port)
