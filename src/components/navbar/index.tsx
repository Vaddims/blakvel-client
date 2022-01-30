import { useEffect, useRef } from 'react';
import { useRedirection } from '../../utils/hooks/useRedirection';
import './navbar.scss';

export enum NavbarPhase {
  native = 'native',
  sticky = 'sticky',  
  hybrid = 'hybrid',
}

interface NavbarProps {
  phase?: NavbarPhase;
}

function Navbar(props: NavbarProps) {
  const phase = props.phase || NavbarPhase.sticky;
  const reference = useRef<HTMLElement>(null);
  const redirect = useRedirection();

  useEffect(() => {
    const { current } = reference;
    if (phase === NavbarPhase.hybrid && current) {
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
        <i className="fa-solid fa-paw"></i>
        <h2>Petshop</h2>
      </div>
      <div className='navbar-section'>
        <ul className='navigation-boundary'>
          <li onClick={redirect('/products')}>Products</li>
          <li>Contact</li>
        </ul>
        <div className='user-account-boundary'>
      
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
