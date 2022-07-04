import AdminPanel from '../../layouts/AdminPanel';
import Page from '../../layouts/Page';

export default function AdminOverview() {
  return (
    <Page>
      <AdminPanel title="Overview">
        <h2 style={{color: 'white'}}>[content]</h2>
      </AdminPanel>
      {/* <AdminPanel title="Overview [PAGE SHOWCASE]"> */}
        {/* <h2 style={{color: 'white'}}>[content]</h2> */}
      {/* </AdminPanel> */}
    </Page>
  )
}