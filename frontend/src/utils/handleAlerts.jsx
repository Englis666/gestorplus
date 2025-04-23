// utils/handleAlerts.js
import { useEffect } from 'react';
import Swal from 'sweetalert2';

/**
 * Sobrescribir window.alert(), window.confirm() y window.prompt()
 * para redirigirlas a alertas personalizadas con SweetAlert2
 */
const useCustomAlerts = () => {
  useEffect(() => {
    // Guardamos los métodos originales para usarlos si es necesario
    const originalAlert = window.alert;
    const originalConfirm = window.confirm;
    const originalPrompt = window.prompt;

    // Sobrescribir window.alert() para usar SweetAlert2
    window.alert = (message) => {
      Swal.fire({
        icon: 'info',
        title: 'Alerta',
        text: message,
      });
    };

    // Sobrescribir window.confirm() para usar SweetAlert2
    window.confirm = (message) => {
      return Swal.fire({
        icon: 'question',
        title: 'Confirmación',
        text: message,
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
      }).then((result) => result.isConfirmed);
    };

    // Sobrescribir window.prompt() para usar SweetAlert2
    window.prompt = (message, defaultValue) => {
      return Swal.fire({
        title: message,
        input: 'text',
        inputValue: defaultValue || '',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
      }).then((result) => result.value);
    };

    // Limpiar los cambios cuando el componente se desmonte
    return () => {
      window.alert = originalAlert;
      window.confirm = originalConfirm;
      window.prompt = originalPrompt;
    };
  }, []); // Solo se ejecuta una vez al montar el componente

  return null;
};

export default useCustomAlerts;
