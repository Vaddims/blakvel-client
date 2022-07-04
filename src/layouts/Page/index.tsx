import { ReactNode, MouseEventHandler } from 'react';
import Navbar, { NavbarMode } from '../Navbar';
import Footer from "../Footer";
import './page.scss';

export interface PageProps {
  id?: string;
  className?: string;
  children?: ReactNode;
  navbarMode?: NavbarMode;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

function Page(props: PageProps) {
  const { id, className, children, navbarMode, onClick } = props;
  const pageClassName = `page ${className ?? ''}`.trim();

  return (
    <div id={id} className={pageClassName} onClick={onClick}>
      <Navbar mode={navbarMode} />
      {children}
      <Footer />
    </div>
  );
}

export default Page;