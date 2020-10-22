import React from 'react';

const Throbber: React.FC = () => (
    <span className="throbber">
        <span className="throbber__bounce throbber__bounce--1" />
        <span className="throbber__bounce throbber__bounce--2" />
        <span className="throbber__bounce" />
    </span>
);

export default Throbber;
