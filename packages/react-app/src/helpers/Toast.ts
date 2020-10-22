import { MutableRefObject, ReactText } from 'react';
import { toast } from 'react-toastify';

export const displayErrorToast = (
    toastIdRef: MutableRefObject<null | ReactText>,
    errorMessage?: string,
) => {
    if (toastIdRef.current === null) {
        toastIdRef.current = toast(errorMessage);
    } else {
        toast.update(toastIdRef.current);
    }

    toast.onChange((numberOfToastDisplayed) => {
        if (numberOfToastDisplayed === 0) {
            toastIdRef.current = null;
        }
    });
};
