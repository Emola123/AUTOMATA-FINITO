from flask import Flask, request,jsonify
from firebase_admin import credentials, initialize_app, db
from firebase import firebase
import json
from flask_cors import CORS

# credenciales y permisos para la base de datos
cred = credentials.Certificate('./automata-fb3f1-firebase-adminsdk-7syuo-485b64d5aa.json')
initialize_app(cred)

# inicialización de la app de Flask
app = Flask(__name__)
CORS(app)

# inicialización de la instancia de Firebase
firebase = firebase.FirebaseApplication('https://automata-fb3f1-default-rtdb.firebaseio.com/', None)

@app.route('/ruta_de_flask', methods=['POST'])
def recibir_datos():    
    palabra = request.json.get('palabra')  # obtenemos la palabra del cuerpo de la solicitud JSON
    estado = request.json.get('estado')  # obtenemos el estado del cuerpo de la solicitud JSON
    
    # creamos un nuevo objeto con la palabra y el estado recibidos
    nuevo_objeto = {
        'palabra': palabra,
        'estado': estado
    }
    
    # guardamos el nuevo objeto en Firebase
    result = firebase.post('/Palabras', nuevo_objeto)
    
    return 'Datos recibidos y guardados correctamente en Firebase'


# ruta de ejemplo para obtener datos de Firebase
@app.route('/Palabras')
def obtener_datos():
    datos = firebase.get('/Palabras', None)
    if datos is None:
        return 'No se encontraron datos en la ruta /Palabras'
    else:
        return json.dumps(datos)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
