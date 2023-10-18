from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, UniqueConstraint, Boolean
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.orm import declarative_base
from passlib.hash import bcrypt  

# Crear un engine para la conexión a la base de datos
engine = create_engine('mysql+pymysql://root@localhost:3306/coinmerge?charset=utf8mb4',
                       echo=True,
                       pool_size=10,
                       max_overflow=20)

# Crear una sesión
Session = sessionmaker(bind=engine)
session = Session()

# Crear la base declarativa
Base = declarative_base()

class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    active = Column(Boolean, nullable=False, default=False) 
    api_credentials = relationship('ApiCredential', uselist=False, back_populates='user')
    login_credentials = relationship('LoginCredential', uselist=False, back_populates='user')
    cookies = relationship('Cookie', back_populates='user')

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.login_credentials = LoginCredential(password_hash=bcrypt.hash(str(password)), user=self)

    def __repr__(self):
        return f'User: {self.username}'
    
    @property  # Añade el decorador @property para que funcione correctamente con Flask-Login
    def is_active(self):
        return self.active  

class ApiCredential(Base):
    __tablename__  = 'api_credential'

    id = Column(Integer, primary_key=True, autoincrement=True)
    exchange = Column(String(100), nullable=False)
    api_key = Column(String(100), nullable=False)
    api_secret = Column(String(100), nullable=False)
    api_password = Column(String(100), nullable=True) 
    user_id = Column(Integer, ForeignKey('user.id'))
    user = relationship('User', back_populates='api_credentials')

    def __repr__(self):
        return f'ApiCredential for user {self.user.username}'

# Resto del código de la clase ApiCredential

class LoginCredential(Base):
    __tablename__  = 'login_credential'

    id = Column(Integer, primary_key=True, autoincrement=True)
    password_hash = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'))
    user = relationship('User', back_populates='login_credentials')

    def check_password(self, password):
        return bcrypt.verify(password, self.password_hash)

    def __repr__(self):
        return f'LoginCredential for user {self.user.username}'

    # Resto del código de la clase LoginCredential

class Cookie(Base):
    __tablename__  = 'cookie' 

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)
    value = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey('user.id'))
    user = relationship('User', back_populates='cookies')

    def __repr__(self):
        return f'Cookie for user {self.user.username}'

    # Resto del código de la clase Cookie

# Especificar el orden de las tablas en la creación de la base de datos
Base.metadata.create_all(bind=engine, tables=[User.__table__, ApiCredential.__table__, LoginCredential.__table__, Cookie.__table__])

# # Crear un usuario
# user = User(username='testuser', email='testuser@example.com', password='testpassword')

# # Añadir el usuario a la sesión
# session.add(user)

# # Guardar los cambios en la base de datos
# session.commit()
