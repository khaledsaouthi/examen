import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => (
  <nav>
    <Link to="/">الطلاب</Link> | <Link to="/add">إضافة طالب</Link>
  </nav>
);

export default NavBar;
