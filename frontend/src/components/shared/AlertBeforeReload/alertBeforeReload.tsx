import { useEffect } from 'react';
import { Modal } from 'antd';

const useBeforeUnload = (message: string) => {
  const handleConfirm = () => {
    window.location.reload();
  };

  useEffect(() => {
    window.addEventListener('beforeunload', (event) => {
      event.preventDefault();  // Prevent immediate reload
      event.returnValue = message;
      return message;
    });

    return () => {
      // Cleanup event listener on unmount
      window.removeEventListener('beforeunload', () => {});
    };
  }, [message]);

  return () => {
    Modal.confirm({
      title: 'Confirm Page Reload',
      content: message,
      onOk: handleConfirm,
    });
  };
};

export default useBeforeUnload;