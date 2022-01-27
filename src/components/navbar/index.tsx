import { useEffect, useRef, MouseEvent } from 'react';
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
  const ref = useRef<HTMLElement>(null);
  const redirect = useRedirection();

  useEffect(() => {
    const { current } = ref;
    if (phase === NavbarPhase.hybrid && current) {
      const onscroll = () => {
        const fixedClassName = 'fixed';
        // smaller than 0 for safari support
        if (document.documentElement.scrollTop <= 0) {
          current.classList.remove(fixedClassName);
        } else {
          current.classList.add(fixedClassName);
        }
      };

      document.addEventListener('scroll', onscroll);
      return () => document.removeEventListener('scroll', onscroll);
    }
  })

  return (
    <nav className={`navbar ${phase}`} ref={ref}>
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
