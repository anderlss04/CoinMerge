from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from flask_login import LoginManager, login_user, UserMixin, login_required, logout_user, current_user
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from bbdd import engine, Base, User, LoginCredential, ApiCredential, session
import ccxt
# from .api import app

# Configuración del objeto LoginManager
login_manager = LoginManager()
# login_manager.init_app(app)

# Clase que representa al usuario de la aplicación
class Usuario(UserMixin):
    def __init__(self, id):
        self.id = id

# Función para cargar un usuario a partir de su ID
@login_manager.user_loader
def load_user(user_id):
    return Usuario(user_id)

# Clase que representa el endpoint de registro
class Registro(Resource):
    def post(self):
        # Se obtienen los datos del usuario desde el cuerpo de la petición
        data = request.get_json()
        username = data['username']
        password = data['password']

        # Se comprueba si el usuario ya existe en la base de datos
        usuario_existente = session.query(User).filter_by(username=username).first()
        if usuario_existente:
            return jsonify({'mensaje': f'El usuario {username} ya existe'}), 400

        # Se crea un nuevo usuario en la base de datos
        nuevo_usuario = User(username=username)
        session.add(nuevo_usuario)
        session.commit()

        # Se crea una nueva credencial de inicio de sesión para el usuario
        nueva_credencial = LoginCredential(user_id=nuevo_usuario.id, password=password)
        session.add(nueva_credencial)
        session.commit()

        return jsonify({'mensaje': f'El usuario {username} ha sido creado'}), 201

# Clase que representa el endpoint de inicio de sesión
class Login(Resource):
    def post(self):
        # Se obtienen los datos del usuario desde el cuerpo de la petición
        data = request.get_json()
        username = data['username']
        password = data['password']

        # Se comprueba si el usuario y la contraseña son válidos
        usuario = session.query(User).filter_by(username=username).first()
        if not usuario:
            return jsonify({'mensaje': 'Nombre de usuario o contraseña incorrectos'}), 401

        credencial = session.query(LoginCredential).filter_by(user_id=usuario.id).first()
        if not credencial or not credencial.check_password(password):
            return jsonify({'mensaje': 'Nombre de usuario o contraseña incorrectos'}), 401

        # Se inicia la sesión de usuario y se crea un token de acceso
        login_user(usuario)
        token_acceso = create_access_token(identity=usuario.id)

        return jsonify({'token_acceso': token_acceso}), 200
    
# Clase que representa el endpoint de cierre de sesión
class Logout(Resource):
    @jwt_required()
    def post(self):
        # Se cierra la sesión de usuario
        logout_user()
        return jsonify({'mensaje': 'Sesión cerrada correctamente'}), 200
    
# Clase que representa el endpoint de información del usuario
class UsuarioInfo(Resource):
    # @jwt_required()
    def get(self):
        # Se obtiene la información del usuario actual
        usuario_actual = session.query(User).filter_by(id=current_user.id).first()
        api_credencial = session.query(ApiCredential).filter_by(user_id=usuario_actual.id).first()

        # Se crea una instancia de CCXT para obtener la información del saldo
        exchange = ccxt.binance({
            'apiKey': api_credencial.api_key,
            'secret': api_credencial.secret_key
        })

        balance = exchange.fetch_balance()
        usdt_balance = balance['USDT']['free']
        btc_balance = balance['BTC']['free']

        # Se calculan los indicadores técnicos con TA-Lib
        prices = exchange.fetch_ohlcv('BTC/USDT', '1d')
        close_prices = [price[4] for price in prices]

        return jsonify({
            'username': usuario_actual.username,
            'saldo_usdt': usdt_balance,
            'saldo_btc': btc_balance,
        }), 200

# Clase que representa el endpoint de saber si hay una sesión iniciada
class SesionIniciada(Resource):
    @jwt_required()
    def get(self):
        return jsonify({'mensaje': 'Sesión iniciada'}), 200
    
