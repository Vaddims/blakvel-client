import { useEffect, useRef } from 'react';
import logo from './logo.png';
import { useRedirection } from '../../utils/hooks/useRedirection';
import UnauthorizedNavbarNavigation from './unauthorized-navigation';
import AdminNavbarNavigation from './admin-navigation';
import './navbar.scss';
import { useAuthentication } from '../../middleware/hooks/useAuthentication';
import { UserRole } from '../../models/user.model';
import AuthorizedNavbarNavigation from './authorized-navigation';

export enum NavbarMode {
  native = 'native',
  sticky = 'sticky',  
  hybrid = 'hybrid',
}

interface NavbarProps {
  mode?: NavbarMode;
}

function Navbar(props: NavbarProps) {
  const phase = props.mode || NavbarMode.sticky;
  const reference = useRef<HTMLElement>(null);
  const redirect = useRedirection();
  const { user } = useAuthentication();

  useEffect(() => {
    const { current } = reference;
    if (phase === NavbarMode.hybrid && current) {
      const onScroll = () => {
        const fixedClassName = 'fixed';

        // smaller than 0 for safari support
        if (document.documentElement.scrollTop <= 0) {
          current.classList.remove(fixedClassName);
        } else {
          current.classList.add(fixedClassName);
        }
      };

      document.addEventListener('scroll', onScroll);
      return () => {
        document.removeEventListener('scroll', onScroll);
      }
    }
  })

  return (
    <nav className={`navbar ${phase}`} ref={reference}>
      <div className='logo-boundary navbar-section' onClick={redirect('/')}>
        <img className='logo' src={logo} />
        <h2>Petshop</h2>
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
