import { useEffect, useRef } from 'react';
import logo from './logo.png';
import { useRedirection } from '../../utils/hooks/useRedirection';
import UnauthorizedNavbarNavigation from './unauthorized-navigation';
import AdminNavbarNavigation from './admin-navigation';
import './navbar.scss';
import { useAuthentication } from '../../middleware/hooks/useAuthentication';
import { UserRole } from '../../models/user.model';
import AuthorizedNavbarNavigation from './authorized-navigation';
import { ReactComponent as Logo} from './blakvel_emblem.svg';

export enum NavbarMode {
  blend = 'blend',
  dynamicBlend = 'dynamicBlend',
  sticky = 'sticky',
}

interface NavbarProps {
  mode?: NavbarMode;
}

function Navbar(props: NavbarProps) {
  const navbarMode = props.mode || NavbarMode.sticky;
  const reference = useRef<HTMLElement>(null);
  const redirect = useRedirection();
  const { user } = useAuthentication();

  useEffect(() => {
    const { current } = reference;
    if (navbarMode === NavbarMode.dynamicBlend && current) {
      const onScroll = () => {
        // smaller than 0 for safari support
        if (document.documentElement.scrollTop <= 0) {
          current.removeAttribute('data-phase');
        } else {
          current.setAttribute('data-phase', 'fixed');
        }
      };

      document.addEventListener('scroll', onScroll);
      return () => {
        document.removeEventListener('scroll', onScroll);
      }
    }
  })

  return (
    <nav className='navbar' data-mode={navbarMode} ref={reference}>
      <div className='logo-boundary navbar-section' onClick={redirect('/')}>
        <Logo className='logo' width={40} height={40} />
        <h2 className='name'>Blakvel</h2>
      </div>
      <div className='navbar-section'>
        <ul className='navigation-boundary'>
          <li onClick={redirect('/products')}>Products</li>
          <li onClick={redirect('/contact')}>Contact</li>
            {user ? (
              user.role === UserRole.Admin ? (
                <AdminNavbarNavigation />
              ) : (
                <AuthorizedNavbarNavigation />
              )
            ) : (
              <UnauthorizedNavbarNavigation />
            )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar;
