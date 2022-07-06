import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import './panel.scss';

export interface PanelProps {
  readonly title: string;
  readonly headerTools?: ReactNode;
  readonly extensions?: ReactNode;
  readonly children?: ReactNode;
  readonly collapseExtensions?: boolean;
  readonly displayBackNavigation?: boolean;
}

export default function Panel(props: PanelProps) {
  const { 
    title, 
    headerTools, 
    children, 
    extensions, 
    collapseExtensions = false ,
    displayBackNavigation = false,
  } = props;

  const navigate = useNavigate();

  return (
    <div className='panel'>
      <header className="panel-header">
        <div className='left-hand-box'>
          {displayBackNavigation &&
            <button className='previous-page-button' onClick={() => navigate(-1)}>
              <i className="fa-solid fa-angle-left fa-3x" />
            </button>
          }
          <div className="panel-title-box">
            <h1 className="panel-title">
              {title}
            </h1>
          </div>
        </div>
        <div className="panel-tools">
          {headerTools}
        </div>
      </header>
      <main className="panel-content-box">
        <section className="panel-content">
          {children}
        </section>
        {(extensions && !collapseExtensions) && 
          <aside className="panel-extensions-boundary">
            <div className="extensions-slidepath">
              <div className="panel-extensions">
                {extensions}
              </div>
            </div>
          </aside>
        }
      </main>
    </div>
  );
}