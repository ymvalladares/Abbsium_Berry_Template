// menu-items.js
import dashboard from './dashboard';
import utilities from './utilities';
import other from './other';
import admin from './admin';
import contentCreator from './contentCreator';

const menuItems = ({ role }) => {
  const items = [dashboard, contentCreator, utilities];

  if (role === 'Admin') items.push(admin);

  return { items };
};

export default menuItems;
