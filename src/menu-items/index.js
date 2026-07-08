// menu-items.js
import dashboard from './dashboard';
import utilities from './utilities';
import other from './other';
import admin from './admin';
import contentCreator from './contentCreator';
import chat from './chat';
import myDealer from './myDealer';

const menuItems = ({ role, hasDealer }) => {
  const items = [dashboard];

  if (role === 'Dealer') items.push(myDealer);
  if (role === 'Admin') items.push(admin);

  items.push(contentCreator, chat);

  return { items };
};

export default menuItems;
