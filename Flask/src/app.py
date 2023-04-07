from flask import Flask
from firebase_admin import credentials, initialize_app, db
from firebase import firebase


#credenciales y permisos para la base de datos

cred = credentials.Certificate('./automata-fb3f1-firebase-adminsdk-7syuo-485b64d5aa.json')
initialize_app(cred)


# inicialización de la app de Flask
app = Flask(__name__)

# inicialización de la instancia de Firebase
firebase = firebase.FirebaseApplication('https://automata-fb3f1-default-rtdb.firebaseio.com/', None)



#objeto nuevo a guardar
nuevo_objeto = {
    'palabra':'ba',
    'Estado':'Aceptado'
}

#obtener la referencia de la tabla o coleccion
referencia = db.reference('Palabras')
referencia.push(nuevo_objeto)

# ruta de ejemplo para obtener datos de Firebase
@app.route('/Palabras')
def obtener_datos():
    datos = firebase.get('/Palabras', None)
    if datos is None:
        return 'No se encontraron datos en la ruta /Palabras'
    else:
        return datos

@app.route('/prueba')
def prueba():
    return 'hola'




if __name__ == '__main__':
    app.run(debug=True)
