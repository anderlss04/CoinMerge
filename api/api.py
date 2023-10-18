from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from flask_login import LoginManager, login_user, UserMixin, login_required, logout_user, current_user
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask_cors import CORS, cross_origin
from flask_caching import Cache
from bbdd import engine, Base, User, LoginCredential, ApiCredential, session
from sqlalchemy.exc import OperationalError
import ccxt
import requests
from datetime import datetime, timedelta
import pandas as pd
from functools import wraps

app = Flask(__name__)
app.secret_key = 'sM5cAVU!@2ex*D^4m&^RV57@vwrT5o78j@&8VddEvQWrrHNj^bpidY6jqC9D'
# Configurar CORS
CORS(app, resources={r"/*": {"origins": "*"}},
     allow_headers=["Content-Type", "Authorization"])
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
api = Api(app)
jwt = JWTManager(app)
cache = Cache(app)
# Variable global para almacenar las instancias de exchanges conectados
exchanges_conectados = {}


app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=20)

# Almacenamiento de la última actividad de cada token
last_activity = {}

def is_token_revoked(decoded_token):
    jti = decoded_token.get('jti')

    # Verificar si el token ha expirado debido a la inactividad
    if jti in last_activity:
        last_action_time = last_activity[jti]
        now = datetime.now()
        if now - last_action_time > timedelta(minutes=20):
            return True  # Token expirado

    # Lógica para verificar si el token está revocado
    revoked_tokens = []  # Lista de tokens revocados (ejemplo)
    return jti in revoked_tokens

# Decorador para verificar si el token está en la lista de revocados
@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, decoded_token):
    return is_token_revoked(decoded_token)

# Decorador para actualizar la última actividad del token
def update_last_activity(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        jti = get_jwt().get('jti')
        last_activity[jti] = datetime.now()
        return f(*args, **kwargs)
    return decorated_function


class ListarExchanges(Resource):
    # @jwt_required()
    @update_last_activity

    def get(self):
        # Aquí podrías consultar la librería ccxt para obtener una lista de exchanges disponibles
        # y devolverla en formato JSON
        return jsonify(ccxt.exchanges)


class ListaCriptomonedas(Resource):
    @jwt_required()
    @update_last_activity
    def get(self, exchange):
        if exchange not in exchanges_conectados:
            return {'mensaje': f'El exchange {exchange} no esta conectado'}, 400

        criptomonedas = exchanges_conectados[exchange].fetch_tickers()
        return jsonify(criptomonedas)


class ConectarAExchange(Resource):
    @jwt_required()
    @update_last_activity
    def post(self, exchange):
        data = request.get_json()
        api_key = data['api_key']
        secret_key = data['secret_key']
        api_password = data.get('api_password', None)

        if api_password is None:
            exchange_instance = getattr(ccxt, exchange)({
                'apiKey': api_key,
                'secret': secret_key,
                'enableRateLimit': True,
            })
        else:
            exchange_instance = getattr(ccxt, exchange)({
                'apiKey': api_key,
                'secret': secret_key,
                'password': api_password,
                'enableRateLimit': True,
            })

        exchanges_conectados[exchange] = exchange_instance

        # Guardar las credenciales de la API en la base de datos
        user_id = get_jwt_identity()
        api_credential = ApiCredential(user_id=user_id, exchange=exchange,
                               api_key=api_key, api_secret=secret_key, api_password=api_password)
        session.add(api_credential)
        session.commit()

        return jsonify({'mensaje': f'Se ha conectado al exchange {exchange} y se han guardado las credenciales en la base de datos'})


class ComprarCrypto(Resource):
    @jwt_required()
    @update_last_activity
    def post(self, exchanges, par, cantidad, tipo_orden='market', precio=None):
        for exchange in exchanges:
            if exchange not in exchanges_conectados:
                return {'mensaje': f'El exchange {exchange} no está conectado'}, 400

            if tipo_orden == 'market':
                exchanges_conectados[exchange].create_market_buy_order(
                    par, cantidad)

            elif tipo_orden == 'limit':
                exchanges_conectados[exchange].create_limit_buy_order(
                    par, cantidad)

            elif tipo_orden == 'stop-loss':
                exchanges_conectados[exchange].create_market_buy_order(
                    par, cantidad, {'stopPrice': precio})

            elif tipo_orden == 'stop-limit':
                exchanges_conectados[exchange].create_limit_buy_order(
                    par, cantidad, precio, {'stopPrice': precio})

        return {'mensaje': f'Se ha realizado una compra de {cantidad} {par} en los exchanges seleccionados'}


class VenderCrypto(Resource):
    @jwt_required()
    @update_last_activity
    def post(self, exchanges, par, cantidad, tipo_orden='market', precio=None):
        for exchange in exchanges:
            if exchange not in exchanges_conectados:
                return {'mensaje': f'El exchange {exchange} no está conectado'}, 400

            if tipo_orden == 'market':
                exchanges_conectados[exchange].create_market_sell_order(
                    par, cantidad)

            elif tipo_orden == 'limit':
                exchanges_conectados[exchange].create_limit_sell_order(
                    par, cantidad)

            elif tipo_orden == 'stop-loss':
                exchanges_conectados[exchange].create_market_sell_order(
                    par, cantidad, {'stopPrice': precio})

            elif tipo_orden == 'stop-limit':
                exchanges_conectados[exchange].create_limit_sell_order(
                    par, cantidad, precio, {'stopPrice': precio})

        return {'mensaje': f'Se ha realizado una venta de {cantidad} {par} en los exchanges seleccionados'}


class ConsultarSaldo(Resource):
    @jwt_required()
    @update_last_activity
    def get(self, exchange):
        if exchange not in exchanges_conectados:
            return {'mensaje': f'El exchange {exchange} no está conectado'}, 400

        saldo = exchanges_conectados[exchange].fetch_balance()
        return jsonify(saldo)


class ConsultarOrdenes(Resource):
    @jwt_required()
    @update_last_activity
    def get(self, exchange):
        # Aquí podrías utilizar la instancia del exchange proporcionada para consultar las órdenes activas
        ordenes_activas = exchanges_conectados[exchange].fetch_open_orders()
        return jsonify(ordenes_activas)


class CancelarOrden(Resource):
    @jwt_required()
    @update_last_activity
    def delete(self, exchange, id_orden):
        # Aquí podrías utilizar la instancia del exchange proporcionada para cancelar una orden activa con el ID proporcionado
        exchanges_conectados[exchange].cancel_order(id_orden)
        return {'mensaje': f'Se ha cancelado la orden {id_orden} en el exchange {exchange.id}'}


class HistorialTransacciones(Resource):
    @jwt_required()
    @update_last_activity
    def get(self, exchange):
        # Aquí podrías utilizar la instancia del exchange proporcionada para consultar el historial de transacciones
        historial = exchanges_conectados[exchange].fetch_my_trades()
        return jsonify(historial)


class InformacionMercado(Resource):
    @jwt_required()
    @update_last_activity
    def get(self, exchange, par):
        # Aquí podrías utilizar la instancia del exchange proporcionada para consultar información de mercado
        ticker = exchanges_conectados[exchange].fetch_ticker(par)
        libro_ordenes = exchanges_conectados[exchange].fetch_order_book(par)
        return {'ticker': ticker, 'libro_ordenes': libro_ordenes}


# Configuración del objeto LoginManager
login_manager = LoginManager()
login_manager.init_app(app)

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
        email = data['email']
        password = data['password']

        # Se comprueba si el usuario ya existe en la base de datos
        usuario_existente = session.query(
            User).filter_by(username=username).first()
        if usuario_existente:
            return {'mensaje': f'El usuario {username} ya existe'}, 400

        # Se crea un nuevo usuario en la base de datos
        nuevo_usuario = User(username=username, email=email, password=password)
        session.add(nuevo_usuario)
        session.commit()

        return {'mensaje': f'El usuario {username} ha sido creado'}, 200

# Clase que representa el endpoint de inicio de sesión


class Login(Resource):
    @cross_origin()
    def post(self):
        # Se obtienen los datos del usuario desde el cuerpo de la petición
        try:
            data = request.get_json()
            email = data['email']
            password = str(data['password'])

            # Se comprueba si el usuario y la contraseña son válidos
            usuario = session.query(User).filter_by(email=email).first()
            if not usuario:
                return {'mensaje': f'Nombre de usuario incorrecto'}, 400
            credencial = session.query(LoginCredential).filter_by(
                user_id=usuario.id).first()
            if not credencial or not credencial.check_password(password):
                return {'mensaje': 'Nombre de usuario o contraseña incorrectos'}, 400
            # Se crea un token de acceso
            token_acceso = create_access_token(identity=usuario.id)
            return {'token': token_acceso}, 200

        except Exception as e:
            return {'mensaje': 'Error en la solicitud'}, 400

# Clase que representa el endpoint de cierre de sesión


class Logout(Resource):
    @jwt_required()
    @update_last_activity
    def post(self):
        # Se cierra la sesión de usuario
        logout_user()
        return {'mensaje': 'Sesión cerrada correctamente'}, 200

# Clase que representa el endpoint de información del usuario


class UsuarioInfo(Resource):
    @jwt_required()
    @update_last_activity
    def get(self):
        # Se obtiene la información del usuario actual
        user_id = get_jwt_identity()
        usuario_actual = session.query(User).filter_by(id=user_id).first()
        # api_credenciales = session.query(ApiCredential).filter_by(
        #     user_id=usuario_actual.id).all()

        balances = {}

        # for api_credencial in api_credenciales:
        #     exchange = api_credencial.exchange
        #     if exchange in exchanges_conectados:
        #         balance = exchanges_conectados[exchange].fetch_balance()
        #         balances[exchange] = {
        #             'saldo_usdt': balance['USDT']['free'],
        #             'saldo_btc': balance['BTC']['free'],
        #         }

        return {
            'username': usuario_actual.username,
            # 'balances': balances,
        }, 200

# Clase que representa el endpoint de saber si hay una sesión iniciada


class SesionIniciada(Resource):
    @jwt_required()
    @update_last_activity
    def get(self):
        return {'mensaje': 'Sesión iniciada'}, 200


@app.route('/listado100', methods=['GET'])
# Agrega la función de almacenamiento en caché con una duración de 5 minutos (300 segundos)
@cache.cached(timeout=90)
def get_top_pairs_in_currency():
    url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=market_cap_desc&per_page=150&page=1&sparkline=false&price_change_percentage=24h"
    response = requests.get(url)
    markets = response.json()
    symbols = []
    for market in markets:
        symbol = market['symbol'].upper()
        price = market['current_price']
        volume = market['total_volume']
        price_change_24h = market['price_change_percentage_24h']
        image = market['image']
        market_cap = market['market_cap']
        market_cap_rank = market['market_cap_rank']
        symbol_info = {
            'symbol': symbol,
            'price': price,
            'volume': volume,
            'price_change_24h': price_change_24h,
            'image': image,
            'market_cap': market_cap,
            'market_cap_rank': market_cap_rank,
        }
        symbols.append(symbol_info)
    return jsonify(symbols)


# Aquí se definen las rutas de la API.
api.add_resource(ListarExchanges, '/exchanges')
api.add_resource(ConectarAExchange, '/exchanges/<string:exchange>')
api.add_resource(
    ComprarCrypto, '/exchanges/<string:exchange>/comprar/<string:par>/<float:cantidad>')
api.add_resource(
    VenderCrypto, '/exchanges/<string:exchange>/vender/<string:par>/<float:cantidad>')
api.add_resource(ConsultarSaldo, '/exchanges/<string:exchange>/saldo')
api.add_resource(ConsultarOrdenes, '/exchanges/<string:exchange>/ordenes')
api.add_resource(
    CancelarOrden, '/exchanges/<string:exchange>/ordenes/<string:id_orden>')
api.add_resource(HistorialTransacciones,
                 '/exchanges/<string:exchange>/historial')
api.add_resource(InformacionMercado,
                 '/exchanges/<string:exchange>/mercado/<string:par>')
api.add_resource(Registro, '/registro')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(UsuarioInfo, '/usuario')
api.add_resource(SesionIniciada, '/sesion_iniciada')
api.add_resource(ListaCriptomonedas,
                 '/exchanges/<string:exchange>/listacriptomonedas')

# Aquí se ejecuta el servidor
if __name__ == '__main__':
    app.run()
