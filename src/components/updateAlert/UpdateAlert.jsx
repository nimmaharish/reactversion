import React from 'react';
import { useEffect, useState } from 'react';
import { AppUpdateService } from 'services/appUpdate';
import { UpdateAlertDialog } from 'components/updateAlert/UpdateAlertDialog';

export function UpdateAlert() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('web');
  useEffect(() => {
    const subscribe = (value, typ) => {
      setOpen(value);
      setType(typ);
    };
    AppUpdateService.on(subscribe);

    return () => {
      AppUpdateService.off(subscribe);
    };
  }, []);

  if (!open) {
    return null;
  }

  return (
    <UpdateAlertDialog type={type} onClose={() => setOpen(false)} />
  );
}
