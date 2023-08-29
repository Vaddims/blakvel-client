import { Link } from "react-router-dom";
import TextInputField from "../../../../components/TextInputField";
import { ProductDto } from "../../../../dto/product/product.dto";
import './sub-product-snapshot-inspector.scss';
import { faDollar } from "@fortawesome/free-solid-svg-icons";

export interface SubProductSnapshotInspectorProps {
  readonly snapshot: any;
}

const SubProductSnapshotInspector: React.FC<SubProductSnapshotInspectorProps> = (props) => {
  const { snapshot } = props;
  
  const dependents = [...snapshot.dependents.orders];

  return (
    <div className="snapshot">
      <div className="information">
        <header>
          <span className="snapshot-creation-date">Created at <span>{new Date(snapshot.snaspshotCreationDate).toDateString()}</span> • {timeAgo(new Date(snapshot.snaspshotCreationDate))}</span>
          <span className="desc">Found <span>{dependents.length} Apearance{dependents.length === 1 ? '' : 's'}</span>, which are at:</span>
        </header>
        <div className="dependencies">
          <div className="orders">
            <span className="t">{snapshot.dependents.orders.length} Orders</span>
            <div className="dep-list">
              {snapshot.dependents.orders.map((order: string) => (
                <li>
                  <Link to={`/orders/${order}/inspect`}><span>{order}</span></Link>
                </li>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="fields">
        <TextInputField fieldClassName="b" inputPrefix="Name" value={snapshot.name} markAsRequired disabled />
        <TextInputField inputPrefix="Price" fieldClassName={`t ${snapshot.discountPrice ? 'b' : ''}`} value={`$${snapshot.price}`} markAsRequired disabled />
        {snapshot.discountPrice && (
          <TextInputField fieldClassName="t" inputPrefix="Discount Price" value={`$${snapshot.discountPrice}`} markAsRequired disabled />
        )}
      </div>
    </div>
  )
}

export default SubProductSnapshotInspector;

function timeAgo(date: Date) {
  const formatter = new Intl.RelativeTimeFormat('en');
  const ranges = {
    years: 3600 * 24 * 365,
    months: 3600 * 24 * 30,
    weeks: 3600 * 24 * 7,
    days: 3600 * 24,
    hours: 3600,
    minutes: 60,
    seconds: 1
  } as const;
  const secondsElapsed = (date.getTime() - Date.now()) / 1000;
  for (const rangeKey in ranges) {
    const key = rangeKey as keyof typeof ranges
    if (ranges[key] < Math.abs(secondsElapsed)) {
      const delta = secondsElapsed / ranges[key];
      return formatter.format(Math.round(delta), key);
    }
  }
}