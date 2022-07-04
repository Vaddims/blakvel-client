import { ReactNode } from 'react';
import './panel.scss';

export interface PanelProps {
  readonly title: string;
  readonly headerTools?: ReactNode;
  readonly extensions?: ReactNode;
  readonly children?: ReactNode;
  readonly collapseExtensions?: boolean;
}

export default function Panel(props: PanelProps) {
  const { 
    title, 
    headerTools, 
    children, 
    extensions, 
    collapseExtensions = false 
  } = props;

  return (
    <div className='panel'>
      <header className="panel-header">
        <div className="panel-title-box">
          <h1 className="panel-title">
            {title}
          </h1>
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