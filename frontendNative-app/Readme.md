# Esta es la estructura de la aplicacion
📦 mi-app/
 ┣ 📂 assets/              # Recursos estáticos
 ┣ 📂 src/                 # Código fuente
 ┃ ┣ 📂 api/               # Llamadas a la API
 ┃ ┣ 📂 components/        # Componentes reutilizables
 ┃ ┣ 📂 hooks/             # Hooks personalizados
 ┃ ┣ 📂 navigation/        # Configuración de navegación
 ┃ ┣ 📂 screens/           # Pantallas de la app
 ┃ ┣ 📂 store/             # Gestión de estado
 ┃ ┣ 📂 styles/            # Estilos globales
 ┃ ┣ 📂 utils/             # Funciones auxiliares
 ┃ ┗ 📜 App.js             # Punto de entrada de la aplicación
 ┣ 📜 package.json         # Dependencias
 ┣ 📜 app.json             # Configuración de Expo
 ┣ 📜 babel.config.js      # Configuración de Babel
 ┗ 📜 .gitignore           # Archivos ignorados por Git
# Depoendencias necesarias
npm install axios react-navigation react-native-gesture-handler
npm install @react-navigation/native @react-navigation/stack 
npm install react-native-screens react-native-safe-area-context react-native-vector-icons react-native-reanimated react-native-gesture-handler react-native-mmkv
npm install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage

# Descripcion Dependencias
@react-navigation/native: Core de navegación en React Native.
@react-navigation/stack: Navegación en stack para cambiar entre pantallas.
react-native-screens y react-native-safe-area-context: Mejoran el rendimiento en la navegación.
react-native-reanimated: Necesario para animaciones en react-navigation.
react-native-gesture-handler: Manejo avanzado de gestos.
react-native-vector-icons: Íconos para la UI.
react-native-mmkv: Almacenamiento rápido y seguro en React Native.