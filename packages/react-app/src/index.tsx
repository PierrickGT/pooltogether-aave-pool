import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import { cssTransition, toast } from 'react-toastify';

import Root from 'app/Root';

import 'react-toastify/dist/ReactToastify.css';
import 'index.scss';

ReactModal.setAppElement('#root');

toast.configure({
    className: 'toaster-container',
    toastClassName: 'toaster',
    bodyClassName: 'toaster__message',
    closeButton: <CloseOutlined />,
    hideProgressBar: true,
    position: 'top-center',
    transition: cssTransition({
        enter: `Toastify__slide-enter`,
        exit: `Toastify__slide-exit`,
        duration: [350, 1400],
        appendPosition: true,
    }),
});

ReactDOM.render(<Root />, document.getElementById('root'));
