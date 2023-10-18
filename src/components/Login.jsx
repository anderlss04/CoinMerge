import React, { useState } from "react";
import { useSpring, animated, a } from "react-spring";
import { FiUser, FiLock } from "react-icons/fi";
import { MdEmail } from "react-icons/md";
import {
  Button,
  InputGroup,
  InputLeftElement,
  cookieStorageManager,
} from "@chakra-ui/react";
import * as Yup from "yup";
import zxcvbn from "zxcvbn";

function Login() {
  const emailSpring = useSpring({
    from: { opacity: 0, transform: "translateX(-50px)" },
    to: { opacity: 1, transform: "translateX(0)" },
    config: { mass: 1, tension: 120, friction: 14 },
  });

  const passwordSpring = useSpring({
    from: { opacity: 0, transform: "translateX(50px)" },
    to: { opacity: 1, transform: "translateX(0)" },
    config: { mass: 1, tension: 120, friction: 14 },
  });

  const buttonSpring = useSpring({
    from: { opacity: 0, transform: "translateY(50px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { mass: 1, tension: 120, friction: 14 },
  });

  const [isValid, setIsValid] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [passwordVerification, setPasswordVerification] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const showErrorMessage = (errorMessage) => {
    const errorElement = document.getElementById("error-message");
    errorElement.textContent = errorMessage;
    errorElement.style.display = "block";
  };

  const hideErrorMessage = () => {
    const errorElement = document.getElementById("error-message");
    errorElement.style.display = "none";
  };

  const handleLogin = async () => {
    const emailInput = document.getElementById("email-input");
    const passwordInput = document.getElementById("password-input");
    const email = emailInput.value;
    const password = passwordInput.value;

    hideErrorMessage();

    const schema = Yup.object().shape({
      email: Yup.string()
        .email("El email debe ser válido")
        .required("El email es obligatorio"),
      password: Yup.string().required("La contraseña es obligatoria"),
    });

    try {
      await schema.validate({ email, password });

      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      switch (response.status) {
        case 200:
          setIsValid(true);
          window.location.href = "/dashboard";
          document.cookie = `token=${data.token}; path=/; session`;
          break;
        case 400:
          setIsValid(false);
          showErrorMessage(data.mensaje);
          break;
        default:
          setIsValid(false);
          showErrorMessage("Ha ocurrido un error en el servidor");
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        showErrorMessage(error.errors[0]);
      } else {
        console.log(error);
        setIsValid(false);
      }
    }
  };

  const handleRegister = async () => {
    const usernameInput = document.getElementById("username-input");
    const emailInput = document.getElementById("email-input");
    const passwordInput = document.getElementById("password-input");
    const passwordVerificationInput = document.getElementById(
      "password-verification-input"
    );
    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const passwordVerification = passwordVerificationInput.value;

    hideErrorMessage();

    const schema = Yup.object().shape({
      username: Yup.string().required("El nombre de usuario es obligatorio"),
      email: Yup.string()
        .email("El email debe ser válido")
        .required("El email es obligatorio"),
      password: Yup.string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .required("La contraseña es obligatoria"),
    });

    try {
      await schema.validate({ username, email, password });

      if (password !== passwordVerification) {
        showErrorMessage("Las contraseñas no coinciden");
        return;
      }

      const passwordStrength = zxcvbn(password).score;

      if (passwordStrength < 2) {
        showErrorMessage(
          "La contraseña es demasiado débil, intenta con combinaciones de letras, números, símbolos y mayúsculas"
        );
        return;
      }

      const response = await fetch("http://127.0.0.1:5000/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });
      await response.json();
      switch (response.status) {
        case 200:
          setIsRegistering(false);
          setIsValid(true);
          break;
        case 400:
          const data = await response.json();
          setIsValid(false);
          showErrorMessage(data.mensaje);
          break;
        default:
          setIsValid(false);
          showErrorMessage("Ha ocurrido un error en el servidor");
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        showErrorMessage(error.errors[0]);
      } else {
        console.log(error);
        setIsValid(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-green-400 via-green-500 to-green-600">
      <div className="w-full max-w-sm px-4 py-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-center">
          {isRegistering ? "Registro" : "Iniciar sesión"}
        </h2>
        {/* Input para añadir el nombre de usuario */}
        {isRegistering && (
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<FiUser color="#A0AEC0" />}
            />
            <input
              type="text"
              placeholder="Nombre de usuario"
              id="username-input"
              className="w-full py-2 pl-10 transition-all duration-200 border rounded-lg focus:outline-none focus:shadow-outline-gray focus:border-blue-500"
            />
          </InputGroup>
        )}
        {/* Input para añadir el correo electrónico */}
        <animated.div style={emailSpring}>
          <InputGroup className="mt-4">
            <InputLeftElement
              pointerEvents="none"
              children={<MdEmail color="#A0AEC0" />}
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              id="email-input"
              className="w-full py-2 pl-10 transition-all duration-200 border rounded-lg focus:outline-none focus:shadow-outline-gray focus:border-blue-500"
            />
          </InputGroup>
        </animated.div>

        {/* Input para añadir la contraseña */}
        <animated.div style={passwordSpring}>
          <InputGroup className="mt-4">
            <InputLeftElement
              pointerEvents="none"
              children={<FiLock color="#A0AEC0" />}
            />
            <input
              type="password"
              placeholder="Contraseña"
              id="password-input"
              className="w-full py-2 pl-10 transition-all duration-200 border rounded-lg focus:outline-none focus:shadow-outline-gray focus:border-blue-500"
            />
          </InputGroup>
        </animated.div>

        {/* Input para verificar la contraseña */}
        {isRegistering && (
          <InputGroup className="mt-4">
            <InputLeftElement
              pointerEvents="none"
              children={<FiLock color="#A0AEC0" />}
            />
            <input
              type="password"
              placeholder="Verificar contraseña"
              id="password-verification-input"
              className="w-full py-2 pl-10 transition-all duration-200 border rounded-lg focus:outline-none focus:shadow-outline-gray focus:border-blue-500"
              onChange={(event) => setPasswordVerification(event.target.value)}
            />
          </InputGroup>
        )}

        {/* Mensaje de error en caso de que la autenticación falle */}
        <div
          id="error-message"
          className="text-red-500 text-sm font-bold mt-2"
          style={{ display: "none" }}
        >
          {errorMessage}
        </div>

        {/* Botón para iniciar sesión o registrar una nueva cuenta */}
        <animated.div style={buttonSpring} className="mt-8">
          <Button
            colorScheme="blue"
            onClick={isRegistering ? handleRegister : handleLogin}
            className="bg-emerald-400 hover:bg-emerald-600 rounded-full w-full font-bold py-2 px-4 text-slate-800"
          >
            {isRegistering ? "Registrarse" : "Iniciar sesión"}
          </Button>
        </animated.div>

        {/* Cambiar entre iniciar sesión y registro */}
        <p className="mt-4 text-sm text-center">
          {isRegistering ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}{" "}
          <span
            className="text-blue-500 cursor-pointer hover:text-blue-700"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Iniciar sesión" : "Registrarse"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;