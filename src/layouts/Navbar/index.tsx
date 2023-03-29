import { useEffect, useRef } from 'react';
import logo from './logo.png';
import { useRedirection } from '../../utils/hooks/useRedirection';
import UnauthorizedNavbarNavigation from './unauthorized-navigation';
import AdminNavbarNavigation from './admin-navigation';
import { useSelector } from 'react-redux';
import { selectUser } from '../../services/slices/userSlice';
import './navbar.scss';

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
  const user = useSelector(selectUser);
  // const { data: user, refetch } = useGetAuthenticatedUserQuery();

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
        {/* <i className="fa-solid fa-paw"></i> */}
        <img className='logo' src={logo} />
        <h2>Petshop</h2>
      </div>
      <div className='navbar-section'>
        <ul className='navigation-boundary'>
          <li onClick={redirect('/products')}>Products</li>
          <li onClick={redirect('/contact')}>Contact</li>
            {user ? <AdminNavbarNavigation /> : <UnauthorizedNavbarNavigation />}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar;
