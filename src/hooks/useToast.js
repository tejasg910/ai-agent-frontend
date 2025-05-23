import {showToast} from 'nextjs-toast-notify';

export function useToast() {

  const showSuccess = (message) => {
    showToast.success(message, {
      sound: true,
      className: 'bg-success/10 text-success border border-success/20',
    });
  };

  const showError = (message) => {
    showToast.error(message, {
      sound: true,
      className: 'bg-error/10 text-error border border-error/20',
    });
  };

  const showInfo = (message) => {
    showToast.info(message, {
      sound: true,
      className: 'bg-info/10 text-info border border-info/20',
    });
  };

  const showWarning = (message) => {
    showToast.warning(message, {
      sound: true,
      className: 'bg-warning/10 text-warning border border-warning/20',
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
}