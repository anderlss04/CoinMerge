import React from "react";
import { useSpring, animated } from "react-spring";
import coinmergeImage from "../assets/coinmerge-image.webp";
import tradingImage from "../assets/trading-image.webp";
import securityImage from "../assets/security-image.webp";

function MainContent() {
  const containerSpring = useSpring({
    from: { opacity: 0, transform: "translateY(50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { mass: 1, tension: 120, friction: 14 },
  });

  const textSpring = useSpring({
    from: { opacity: 0, transform: "translateX(-50px)" },
    to: { opacity: 1, transform: "translateX(0)" },
    config: { mass: 1, tension: 120, friction: 14 },
  });

  const buttonSpring = useSpring({
    from: { opacity: 0, transform: "translateY(50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { mass: 1, tension: 120, friction: 14 },
  });

  const imageSpring = useSpring({
    from: { opacity: 0, transform: "scale(0.95)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: { mass: 1, tension: 120, friction: 14 },
  });

  return (
    <animated.main
      className="bg-gray-100 py-12 min-h-screen"
      style={containerSpring}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <animated.h2
              className="text-4xl font-bold text-gray-900 mb-4"
              style={textSpring}
            >
              Bienvenido a CoinMerge
            </animated.h2>
            <animated.p
              className="text-xl text-gray-600 mb-6"
              style={textSpring}
            >
              En CoinMerge, nos dedicamos a brindar soluciones financieras de
              vanguardia para la nueva era digital. Nuestra plataforma de
              trading de criptomonedas líder en el mercado te permite comprar,
              vender e intercambiar una variedad de monedas digitales con total
              confianza y seguridad.
            </animated.p>
            <animated.button
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 px-6 mt-8 font-medium"
              style={buttonSpring}
            >
              <a href="/login">Crea una cuenta ahora</a>
            </animated.button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <animated.div
              className="bg-white rounded-lg shadow-md overflow-hidden"
              style={imageSpring}
            >
              <img
                src={coinmergeImage}
                alt="CoinMerge plataforma de criptomonedas"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">
                  Plataforma de Criptomonedas
                </h3>
                <p className="text-gray-700">
                  Accede a una plataforma intuitiva y fácil de usar, donde
                  podrás comprar y vender una gran variedad de criptomonedas con
                  las mejores tasas del mercado.
                </p>
              </div>
            </animated.div>
            <animated.div
              className="bg-white rounded-lg shadow-md overflow-hidden"
              style={imageSpring}
            >
              <img src={tradingImage} alt="CoinMerge plataforma de trading" />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">
                  Plataforma de Trading
                </h3>
                <p className="text-gray-700">
                  Con nuestra plataforma de trading de criptomonedas, podrás
                  realizar operaciones de compra y venta en tiempo real con
                  facilidad y rapidez.
                </p>
              </div>
            </animated.div>
            <animated.div
              className="bg-white rounded-lg shadow-md overflow-hidden"
              style={imageSpring}
            >
              <img src={securityImage} alt="CoinMerge seguridad" />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2">
                  Seguridad y Confianza
                </h3>
                <p className="text-gray-700">
                  En CoinMerge, la seguridad de nuestros usuarios es nuestra
                  prioridad. Utilizamos la mejor tecnología y los protocolos más
                  avanzados para proteger tus fondos y datos personales.
                </p>
              </div>
            </animated.div>
          </div>
        </div>
      </div>
      <section class="faq-section p-16">
        <div class="container mx-auto">
          <h2 class="text-4xl font-bold text-gray-900 mb-8 text-center">
            Preguntas Frecuentes
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="faq-item">
              <h3 class="text-2xl font-bold text-gray-900 mb-4">
                ¿Cómo creo una cuenta?
              </h3>
              <p class="text-gray-700 mb-8">
                Para crear una cuenta, simplemente haz clic en el botón
                "Registrarse" en la parte superior de la página y sigue las
                instrucciones.
              </p>
            </div>

            <div class="faq-item">
              <h3 class="text-2xl font-bold text-gray-900 mb-4">
                ¿Puedo comprar criptomonedas con mi tarjeta de crédito?
              </h3>
              <p class="text-gray-700 mb-8">
                Sí, aceptamos tarjetas de crédito como forma de pago para
                comprar criptomonedas.
              </p>
            </div>

            <div class="faq-item">
              <h3 class="text-2xl font-bold text-gray-900 mb-4">
                ¿Cómo puedo verificar mi cuenta?
              </h3>
              <p class="text-gray-700 mb-8">
                Para verificar tu cuenta, debes proporcionar información
                personal y documentos de identificación. Sigue las instrucciones
                en la página de verificación para completar el proceso.
              </p>
            </div>

            <div class="faq-item">
              <h3 class="text-2xl font-bold text-gray-900 mb-4">
                ¿Cómo puedo vender mis criptomonedas?
              </h3>
              <p class="text-gray-700 mb-8">
                Para vender tus criptomonedas, ve a la página de venta y sigue
                las instrucciones. Asegúrate de tener suficientes fondos
                disponibles en tu cuenta para completar la transacción.
              </p>
            </div>
          </div>
        </div>
      </section>
    </animated.main>
  );
}

export default MainContent;
